const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const Matched = sequelize.define(
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
    },
    {
      tableName: "Matched",
      timestamps: true,
    }
  );

  // creates a table if it does not exist
  // { force: true } - new db in each initialization)
  sequelize.sync();
  console.log("[Database] Matched Model initialized");
  return Matched;
};
