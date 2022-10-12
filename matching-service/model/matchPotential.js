const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
  return sequelize.define(
    "MatchPotential",
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      socketId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "matchPotentials",
      timestamps: true,
      updatedAt: false,
    }
  );
};
