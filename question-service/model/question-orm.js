const {
  createQuestion,
  getAllQuestionByDifficulty,
  getAllQuestions,
  getQuestionById,
  deleteQuestionById,
  deleteAssignedQuestionById,
  getAssignedQuestion,
  assignQuestion,
} = require("./db-interaction");
const { DbInvalidIdError } = require("../errors");
require("dotenv/config");

async function ormCreateQuestion(difficulty, title, content) {
  const question = await createQuestion(difficulty, title, content);

  const res = {
    qid: question.qid,
    difficulty: question.difficulty,
    title: question.title,
    content: question.content,
  };
  return res;
}

async function ormGetQuestionByDifficulty(matchId, difficulty) {
  let question = {};
  const assignment = await getAssignedQuestion(matchId);
  if (assignment != null) {
    question = await getQuestionById(assignment.dataValues.qid);
  } else {
    const questions = await getAllQuestionByDifficulty(difficulty);
    const randomIndex = Math.round(Math.random() * (questions.length - 1));
    question = questions[randomIndex];
    await assignQuestion(matchId, question.qid);
  }
  return {
    qid: question.qid,
    difficulty: question.difficulty,
    title: question.title,
    content: question.content,
  };
}

async function ormGetAllQuestions() {
  return await getAllQuestions();
}

async function ormGetQuestionById(qid) {
  const question = await getQuestionById(qid);
  return {
    qid: question.qid,
    difficulty: question.difficulty,
    title: question.title,
    content: question.content,
  };
}

async function ormDeleteQuestion(id) {
  const question = await getQuestionById(id);
  if (question === null) {
    throw new DbInvalidIdError();
  }
  return await deleteQuestionById(id);
}

async function ormDeleteAssignedQuestion(matchId) {
  const question = await getAssignedQuestion(matchId);
  if (question === null) {
    throw new DbInvalidIdError();
  }
  return await deleteAssignedQuestionById(matchId);
}

module.exports = {
  ormCreateQuestion,
  ormGetQuestionByDifficulty,
  ormGetAllQuestions,
  ormDeleteQuestion,
  ormDeleteAssignedQuestion,
  ormGetQuestionById,
};
