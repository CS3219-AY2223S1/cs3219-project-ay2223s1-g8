const {
  createQuestionModel,
  createAssignedQuestionsModel,
} = require("./question-model");
const Question = createQuestionModel();
const AssignedQuestions = createAssignedQuestionsModel({
  questionModel: Question,
});
const {
  DbDuplicateTitleError,
  DbInvalidIdError,
  DbInvalidDifficultyError,
  DbNoMatchingQuestionsError,
} = require("../errors");

async function createQuestion(difficulty, title, content) {
  await Question.sync();
  const conflictingQuestion = await Question.findOne({ where: { title } });
  if (conflictingQuestion != null) {
    throw new DbDuplicateTitleError();
  }
  return await Question.create({ difficulty, title, content });
}

async function getAssignedQuestion(matchId) {
  await AssignedQuestions.sync();
  const assignment = await AssignedQuestions.findOne({ where: { matchId } });
  console.log("assign", assignment);
  return assignment;
}

async function assignQuestion(matchId, qid) {
  await AssignedQuestions.sync();
  return await AssignedQuestions.create({ matchId, qid });
}

async function getAllQuestionByDifficulty(difficulty) {
  await Question.sync();
  if (
    difficulty !== "EASY" &&
    difficulty !== "MEDIUM" &&
    difficulty !== "HARD" &&
    difficulty !== "ANY"
  ) {
    throw new DbInvalidDifficultyError();
  }
  let questions = {};
  if (difficulty == "ANY") {
    questions = await Question.findAll();
  }
  questions = await Question.findAll({ where: { difficulty } });
  if (questions.length == 0) {
    throw new DbNoMatchingQuestionsError();
  }
  return questions;
}

async function getQuestionById(qid) {
  try {
    await Question.sync();
    const question = await Question.findOne({ where: { qid } });
    if (question === null) {
      throw new DbInvalidIdError();
    }
    return question;
  } catch (e) {
    if (e.name === "SequelizeDatabaseError") {
      throw new DbInvalidIdError();
    } else {
      throw e;
    }
  }
}

async function getAllQuestions() {
  await Question.sync();
  const questions = await Question.findAll();
  return questions;
}

async function deleteQuestionById(qid) {
  await Question.sync();
  await Question.destroy({ where: { qid } });
  return true;
}

async function deleteAssignedQuestionById(matchId) {
  await AssignedQuestions.sync();
  await AssignedQuestions.destroy({ where: { matchId } });
  return true;
}

module.exports = {
  createQuestion,
  getAllQuestionByDifficulty,
  getAllQuestions,
  getQuestionById,
  deleteQuestionById,
  deleteAssignedQuestionById,
  getAssignedQuestion,
  assignQuestion,
};
