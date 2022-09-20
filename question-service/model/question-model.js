const { Model, DataTypes } = require("sequelize");
const { Sequelize } = require("./database.js");
const sequelize = require("./database.js");

class Question extends Model {}

function createQuestionModel(s = sequelize) {
  return Question.init(
    {
      qid: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.ENUM("EASY", "MEDIUM", "HARD"),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize: s,
      modelName: "question",
      timestamps: false,
    }
  );
}

module.exports = createQuestionModel;
