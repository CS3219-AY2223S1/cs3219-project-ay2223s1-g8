const { createMatchedModel, createMatchPotentialModel } = require("../model");
const {
  DuplicateMatchPotentialError,
  InvalidMatchPotentialError,
  DuplicateMatchedError,
  NoMatchedError,
} = require("../utils/errors");
const { generateMatchId } = require("../utils/match");
const { Op } = require("sequelize");
const { sequelize } = require("../database");

class MatchController {
  constructor(s = sequelize) {
    createMatchedModel(s);
    createMatchPotentialModel(s);
    // creates a table if it does not exist
    // { force: true } - new tables in each initialization)
    s.sync({ force: true });
    console.log("[Database] Matched Model initialized");
    console.log("[Database] Match Potential Model initialized");
    this.client = s;
    this.models = s.models;
  }

  async hasMatchPotential(userId) {
    await sequelize.sync();
    const matchPotentials = await this.models.MatchPotential.findOne({
      where: { userId },
    });
    console.log(matchPotentials);
    return !(matchPotentials == null || matchPotentials.length === 0);
  }

  async createMatchPotential(userId, level, socketId) {
    await sequelize.sync();
    const hasMatchPotential = await this.hasMatchPotential(userId);
    if (hasMatchPotential) {
      throw new DuplicateMatchPotentialError();
    }
    return await this.models.MatchPotential.create({ userId, level, socketId });
  }

  async findOneMatchPotential(userId) {
    await sequelize.sync();
    const matchPotential = await this.models.MatchPotential.findOne({
      where: { userId },
    });
    if (matchPotential === null) {
      throw new InvalidMatchPotentialError();
    }
    return matchPotential;
  }

  async deleteMatchPotential(userId) {
    await sequelize.sync();
    const hasMatchPotential = await this.hasMatchPotential(userId);
    if (!hasMatchPotential) {
      throw new InvalidMatchPotentialError();
    }
    await this.models.MatchPotential.destroy({ where: { userId } });
    return true;
  }

  async findMatchesWhereLevel(level) {
    await sequelize.sync();
    let matches;
    if (level == "any") {
      matches = await this.models.MatchPotential.findOne({
        order: [["createdAt", "ASC"]],
      });
    } else {
      matches = await this.models.MatchPotential.findOne({
        where: {
          [Op.or]: [{ level: level }, { level: "any" }],
        },
        order: [["createdAt", "ASC"]],
      });
    }
    if (matches === null || matches.length === 0) {
      //throw new NoMatchPotentialError();
      return null;
    }
    return matches;
  }

  async hasMatchedId(matchedId) {
    await sequelize.sync();
    const matched = await this.models.Matched.findOne({ where: { matchedId } });
    return !(matched === null || matched.length === 0);
  }

  async hasMatchedSocketId(socketId) {
    await sequelize.sync();
    const matched = await this.models.Matched.findOne({
      where: {
        [Op.or]: [{ socketId1: socketId }, { socketId2: socketId }],
      },
    });
    return !(matched === null || matched.length === 0);
  }

  async checkIsUserMatched(userId) {
    await sequelize.sync();
    const matched = await this.models.Matched.findAll({
      where: {
        [Op.or]: [{ userId1: userId }, { userId2: userId }],
      },
    });
    return !(matched.length === 0);
  }

  async findMatchedWhereUserId(userId) {
    await sequelize.sync();
    const matched = await this.models.Matched.findOne({
      where: {
        [Op.or]: [{ userId1: userId }, { userId2: userId }],
      },
    });
    if (matched === null || matched.length === 0) {
      return null;
    } else {
      return matched;
    }
  }

  async createMatched(userId1, userId2, level, socketId1, socketId2) {
    await sequelize.sync();
    const isUserId1Matched = await this.checkIsUserMatched(userId1);
    const isUserId2Matched = await this.checkIsUserMatched(userId2);
    if (isUserId1Matched || isUserId2Matched) {
      throw new DuplicateMatchedError();
    }
    const matchedId = generateMatchId();
    return await this.models.Matched.create({
      matchedId,
      userId1,
      userId2,
      level,
      socketId1,
      socketId2,
    });
  }

  async removeMatchedByMatchId(matchedId) {
    await sequelize.sync();
    const hasMatchedId = await this.hasMatchedId(matchedId);
    if (!hasMatchedId) {
      throw new NoMatchedError();
    }
    await this.models.Matched.destroy({ where: { matchedId } });
    return true;
  }

  async removeMatchedBySocketId(socketId) {
    await sequelize.sync();
    const hasMatchedSocketId = await this.hasMatchedSocketId(socketId);
    if (!hasMatchedSocketId) {
      throw new NoMatchedError();
    }
    await this.models.Matched.destroy({
      where: {
        [Op.or]: [{ socketId1: socketId }, { socketId2: socketId }],
      },
    });
    return true;
  }
}

module.exports = MatchController;
