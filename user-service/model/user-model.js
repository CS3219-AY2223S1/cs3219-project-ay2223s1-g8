const { Model, DataTypes } = require("sequelize");
const { Sequelize } = require("./database.js");
const sequelize = require("./database.js");

class User extends Model {}

function createUserModel(s = sequelize) {
  return User.init(
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isLongEnough(val) {
            if (val.length <= 7) {
              throw new Error("Please choose a longer password");
            }
          },
        },
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
