const { Model, DataTypes } = require("sequelize");
const { Sequelize } = require("./database.js");
const sequelize = require("./database.js");

class Question extends Model {}
class AssignedQuestions extends Model {}

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
        type: DataTypes.ENUM("EASY", "MEDIUM", "HARD", "ANY"),
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

function createAssignedQuestionsModel({ s = sequelize, questionModel }) {
  AssignedQuestions.init(
    {
      matchId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      qid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: questionModel,
          key: "qid",
        },
      },
    },
    {
      sequelize: s,
      modelName: "assignedQuestions",
      timestamps: false,
    }
  );
  AssignedQuestions.hasOne(questionModel, {
    foreignKey: "qid",
    targetKey: "qid",
    constraints: false,
  });
  return AssignedQuestions;
}

module.exports = {
  createQuestionModel,
  createAssignedQuestionsModel,
};
