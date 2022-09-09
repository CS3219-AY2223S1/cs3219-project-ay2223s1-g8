const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MatchPotential = sequelize.define('MatchPotential', {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
        updatedAt: false,
    });

    // creates a table if it does not exist
    // { force: true } - new db in each initialization)
    sequelize.sync();
}