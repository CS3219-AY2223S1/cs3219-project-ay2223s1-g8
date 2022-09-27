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
  console.log(difficulty == "EASY");
  if (
    difficulty !== "EASY" &&
    difficulty !== "MEDIUM" &&
    difficulty !== "HARD"
  ) {
    throw new DbInvalidDifficultyError();
  }
  const questions = await Question.findAll({ where: { difficulty } });
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

module.exports = {
  createQuestion,
  getAllQuestionByDifficulty,
  getAllQuestions,
  getQuestionById,
  deleteQuestionById,
  getAssignedQuestion,
  assignQuestion,
};
