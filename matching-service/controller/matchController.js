const Models = require('../model/matchPotential');
const {
    DuplicateMatchPotentialError,
    InvalidMatchPotentialError,
    NoMatchPotentialError
} = require('../utils/errors');

class MatchController {

    constructor(sequelize) {
      Models(sequelize);
      this.client = sequelize;
      this.models = sequelize.models;
    }

    async createMatchPotential({ userId, level }) {
        const conflictingMatchPotential = await this.models.MatchPotential.findOne({ where: { userId } });
        if (conflictingMatchPotential != null) {
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
        const matchPotential = await this.models.MatchPotential.findOne({ where: { userId } });
        if (matchPotential === null) {
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

}

module.exports = MatchController;