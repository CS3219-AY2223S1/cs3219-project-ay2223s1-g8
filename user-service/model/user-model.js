const { Model, DataTypes } = require("sequelize");
const sequelize = require("./database.js");

class User extends Model {}

function createUserModel(s = sequelize) {
  return User.init(
    {
      username: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: s,
      modelName: "user",
      timestamps: false,
    }
  );
}

module.exports = createUserModel;
