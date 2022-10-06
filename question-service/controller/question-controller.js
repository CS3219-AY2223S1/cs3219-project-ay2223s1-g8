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
  ormGetQuestionById,
} = require("../model/question-orm.js");

async function getQuestionByDifficulty(req, res) {
  try {
    const { matchId, difficulty } = req.body;

    if (!matchId || !difficulty) {
      throw new ValidationError();
    }

    const resp = await ormGetQuestionByDifficulty(matchId, difficulty);
    return res.status(200).json(resp);
  } catch (err) {
    console.log(err);

    if (err instanceof ValidationError) {
      return res
        .status(400)
        .json({ message: "Match id or Difficulty missing!" });
    } else if (err instanceof DbInvalidDifficultyError) {
      return res.status(400).json({ message: "Invalid difficulty!" });
    } else if (err instanceof DbNoMatchingQuestionsError) {
      return res.status(400).json({ message: "No matching questions found!" });
    } else {
      return res.status(500).json({ message: "Database failure!" });
    }
  }
}

async function getAllQuestions(req, res) {
  try {
    const resp = await ormGetAllQuestions();
    return res.status(200).json(resp);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database failure!" });
  }
}

async function createQuestion(req, res) {
  try {
    const { difficulty, title, content } = req.body;

    if (!difficulty || !title || !content) {
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
      return res.status(500).json({ message: "Database failure!" });
    }
  }
}

async function getQuestionById(req, res) {
  try {
    const { qid } = req.body;
    if (!qid) {
      throw new ValidationError();
    }
    const resp = await ormGetQuestionById(qid);
    return res.status(200).json(resp);
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      return res.status(400).json({ message: "Question ID missing!" });
    } else if (err instanceof DbInvalidIdError) {
      return res.status(400).json({ message: "Invalid ID!" });
    } else {
      return res.status(500).json({ message: "Database failure!" });
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
      return res.status(400).json({ message: "ID is missing!" });
    } else if (err instanceof DbInvalidIdError) {
      return res.status(400).json({ message: "Invalid ID!" });
    } else {
      return res.status(500).json({ message: "Database failure!" });
    }
  }
}

module.exports = {
  createQuestion,
  getQuestionByDifficulty,
  getAllQuestions,
  deleteQuestion,
  getQuestionById,
};
