const { createMatchedModel, createMatchPotentialModel } = require('../model');
const {
    DuplicateMatchPotentialError,
    InvalidMatchPotentialError,
    NoMatchPotentialError,
    DuplicateMatchedError,
    NoMatchedError
} = require('../utils/errors');

class MatchController {

    constructor(sequelize) {
    createMatchedModel(sequelize);
    createMatchPotentialModel(sequelize);
      this.client = sequelize;
      this.models = sequelize.models;
    }

    async hasMatchPotential(userId) {
        const matchPotentials = await this.models.MatchPotential.findOne({ where: { userId } });
        return !(matchPotentials === null || matchPotentials.length === 0);
    }

    async createMatchPotential({ userId, level }) {
        if (this.hasMatchPotential(userId)) {
            throw new DuplicateMatchPotentialError();
        }
        return await this.models.MatchPotential.create({ userId, level });
    }

    async findOneMatchPotential(userId) {
        const matchPotential = await this.models.MatchPotential.findOne({ where: { userId } });
        if (matchPotential === null) {
            throw new InvalidMatchPotentialError();
        }
        return matchPotential;
    }

    async deleteMatchPotential(userId) {
        if (!this.hasMatchPotential(userId)) {
            throw new InvalidMatchPotentialError();
        }
        await this.models.MatchPotential.destroy({ where: { userId } });
        return true;
    }

    async findMatchesWhereLevel(level) {
        const matches = await this.models.MatchPotential.findOne({
            where: { level },
            order: [['createdAt', 'ASC']]
        });
        if (matches === null || matches.length === 0) {
            throw new NoMatchPotentialError();
        }
        return matches;
    }

    async hasMatchedId(matchedId) {
        const matched = await this.models.Matched.findOne({ where: { matchedId } });
        return !(matched === null || matched.length === 0);
    }

    async checkIsUserMatched(userId) {
        const matched = await this.models.Matched.findAll({
            where: {
                [Op.or]: [
                    { userId1: userId },
                    { userId2: userId }
                ]
            }
        });
        return !(matched.length === 0);
    }

    async createMatched({ userId1, userId2, level }) {
        if (this.checkIsMatched(userId1) || this.checkIsUserMatched(userId2)) {
            throw new DuplicateMatchedError();
        }
        return await this.models.Matched.create({ userId1, userId2, level });
    }

    async removeMatched(matchedId) {
        if (!this.hasMatchedId(matchedId)) {
            throw new NoMatchedError();
        }
        await this.models.Matched.destroy({ where: { matchedId } });
        return true;
    }

}

module.exports = MatchController;