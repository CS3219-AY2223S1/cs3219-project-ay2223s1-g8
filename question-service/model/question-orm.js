const {
  createQuestion,
  getAllQuestionByDifficulty,
  getAllQuestions,
  getQuestionById,
  deleteQuestionById,
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

async function ormGetQuestionByDifficulty(difficulty) {
  const questions = await getAllQuestionByDifficulty(difficulty);
  const randomIndex = Math.round(Math.random() * (questions.length - 1));
  const question = questions[randomIndex];
  const res = {
    qid: question.qid,
    difficulty: question.difficulty,
    title: question.title,
    content: question.content,
  };
  return res;
}

async function ormGetAllQuestions() {
  return getAllQuestions();
}

async function ormDeleteQuestion(id) {
  const question = await getQuestionById(id);
  if (question === null) {
    throw new DbInvalidIdError();
  }
  return await deleteQuestionById(id);
}

module.exports = {
  ormCreateQuestion,
  ormGetQuestionByDifficulty,
  ormGetAllQuestions,
  ormDeleteQuestion,
};
