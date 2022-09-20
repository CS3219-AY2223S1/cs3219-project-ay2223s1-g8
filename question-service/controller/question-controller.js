const {
  ValidationError,
  DbDuplicateTitleError,
  DbInvalidIdError,
  DbInvalidDifficultyError,
  DbNoMatchingQuestionsError,
} = require("../errors.js");
const {
  ormCreateQuestion,
  ormGetQuestionByDifficulty,
  ormGetAllQuestions,
  ormDeleteQuestion,
} = require("../model/question-orm.js");

async function getQuestionByDifficulty(req, res) {
  try {
    const { difficulty } = req.body;

    if (!difficulty) {
      throw new ValidationError();
    }

    const resp = await ormGetQuestionByDifficulty(difficulty);
    return res.status(200).json(resp);
  } catch (err) {
    console.log(err);

    if (err instanceof ValidationError) {
      return res.status(400).json({ message: "Difficulty missing!" });
    } else if (err instanceof DbInvalidDifficultyError) {
      return res.status(400).json({ message: "Invalid difficulty!" });
    } else if (err instanceof DbNoMatchingQuestionsError) {
      return res.status(400).json({ message: "No matching questions found!" });
    } else {
      return res
        .status(500)
        .json({ message: "Database failure when fetching question!" });
    }
  }
}

async function getAllQuestions(req, res) {
  try {
    const resp = await ormGetAllQuestions();
    return res.status(200).json(resp);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Database failure when creating new user!" });
  }
}

async function createQuestion(req, res) {
  try {
    const { difficulty, title, content } = req.body;

    if (!difficulty || !title || !content) {
      console.log(difficulty, title, content);
      throw new ValidationError();
    }

    const resp = await ormCreateQuestion(difficulty, title, content);
    return res.status(201).json(resp);
  } catch (err) {
    console.log(err);

    if (err instanceof DbDuplicateTitleError) {
      return res.status(409).json({ message: "Duplicate title detected!" });
    } else if (err instanceof ValidationError) {
      return res
        .status(400)
        .json({ message: "Difficulty, title or question missing!" });
    } else {
      return res
        .status(500)
        .json({ message: "Database failure when creating new question!" });
    }
  }
}

async function deleteQuestion(req, res) {
  try {
    const { qid } = req.body;
    if (!qid) {
      throw new ValidationError();
    }

    await ormDeleteQuestion(qid);
    return res.status(200).json({ message: `Deleted question successfully!` });
  } catch (err) {
    console.log(err);

    if (err instanceof ValidationError) {
      return res.status(400).json({ message: "Id is missing!" });
    } else if (err instanceof DbInvalidIdError) {
      return res.status(400).json({ message: "Invalid id!" });
    } else {
      return res
        .status(500)
        .json({ message: "Database failure when deleting question!" });
    }
  }
}

module.exports = {
  createQuestion,
  getQuestionByDifficulty,
  getAllQuestions,
  deleteQuestion,
};
