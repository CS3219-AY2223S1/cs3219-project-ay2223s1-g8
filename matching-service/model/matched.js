const { DataTypes, Sequelize } = require("sequelize");

module.exports = async (sequelize) => {
  return sequelize.define(
    "Matched",
    {
      matchedId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      socketId1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      socketId2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "matched",
      timestamps: true,
    }
  );
};
