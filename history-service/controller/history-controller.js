const {
  ValidationError,
  InvalidIdError,
  InvalidAttemptObjError,
  DuplicateHistoryError,
  NoHistoryFoundError,
  NoAttemptFoundError,
} = require("../errors");
const {
  ormGetAllUserHistory,
  ormGetUserHistory,
  ormGetUserAttempt,
  ormCreateUserHistory,
  ormAddUserAttempt,
  ormDeleteUserHistory,
  ormDeleteAllUserHistory,
} = require("../model/history-orm");

const getAllUserHistory = async (req, res) => {
  try {
    const data = await ormGetAllUserHistory();
    return res.status(200).json({
      message: "All history retrieved successfully!",
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database failure!" });
  }
};

const getUserHistory = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      throw new ValidationError();
    }

    const data = await ormGetUserHistory(uid);
    return res.status(200).json({
      message: "User history retrieved successfully!",
      data,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      return res.status(400)
        .json({ message: "Uid is missing from request body!" });
    } else if (err instanceof InvalidIdError) {
      return res.status(404)
        .json({ message: "Uid is invalid!" });
    } else if (err instanceof NoHistoryFoundError) {
      return res.status(404)
        .json({ message: `Unable to find user history with uid ${uid}.` });
    } else {
      return res.status(500)
        .json({ message: "Database failure!" });
    }
  }
};

const getUserAttempt = async (req, res) => {
  try {
    const { uid, qid } = req.body;

    if (!uid || !qid) {
      throw new ValidationError();
    }

    const data = await ormGetUserAttempt(uid, qid);
    return res.status(200).json({
      message: "User attempt retrieved successfully!",
      data,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      return res.status(400)
        .json({ message: "Uid or qid missing from request body!" });
    } else if (err instanceof NoHistoryFoundError) {
      return res.status(404)
        .json({ message: `Unable to find user history with uid ${uid}.` });
    } else if (err instanceof NoAttemptFoundError) {
      return res.status(404)
        .json({ message: `Unable to find user history ${uid}'s attempt with qid ${qid}.` });
    } else {
      return res.status(500)
        .json({ message: "Database failure!" });
    }
  }
};

const createUserHistory = async (req, res) => {
  try {
    const { uid, attempts } = req.body;

    if (!uid || !attempts) {
      throw new ValidationError();
    }

    attempts.forEach((attempt) => {
      if (!attempt?.qid || !attempt.content) {
        throw new InvalidAttemptObjError();
      }
    });

    const data = await ormCreateUserHistory(uid, attempts);
    return res.status(200).json({
      message: "User history created successfully!",
      data,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      return res.status(400)
        .json({ message: "Uid or attempts missing from request body!" });
    } else if (err instanceof DuplicateHistoryError) {
      return res.status(409)
        .json({ message: "Duplicate user history detected!" });
    } else if (err instanceof InvalidAttemptObjError) {
      return res.status(409)
        .json({ message: "Attempts has the wrong format!" });
    } else {
      return res.status(500)
        .json({ message: "Database failure!" });
    }
  }
};

const addUserAttempt = async (req, res) => {
  try {
    const { uid, attempt } = req.body;

    if (!uid || !attempt) {
      throw new ValidationError();
    }

    if (!attempt.qid || !attempt.content) {
      throw new InvalidAttemptObjError();
    }

    const data = await ormAddUserAttempt(uid, attempt);
    return res.status(200).json({
      message: "User attempt added successfully!",
      data,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      return res.status(400)
        .json({ message: "Uid or attempt missing from request body!" });
    } else if (err instanceof InvalidAttemptObjError) {
      return res.status(409)
        .json({ message: "Attempt has the wrong format!" });
    } else {
      return res.status(500)
        .json({ message: "Database failure!" });
    }
  }
};

const deleteUserHistory = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      throw new ValidationError();
    }

    const data = await ormDeleteUserHistory(uid);
    return res.status(200).json({
      message: "User history deleted successfully!",
      data,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationError) {
      return res.status(400)
        .json({ message: "Uid missing from request body!" });
    } else if (err instanceof NoHistoryFoundError) {
      return res.status(404)
        .json({ message: `Unable to find user history with uid ${uid}.` });
    } else {
      return res.status(500)
        .json({ message: "Database failure!" });
    }
  }
};

const deleteAllUserHistory = async (req, res) => {
  try {
    const data = await ormDeleteAllUserHistory();
    return res.status(200).json({
      message: "All user history deleted successfully!",
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database failure!" });
  }
};

module.exports = {
  getAllUserHistory,
  getUserHistory,
  getUserAttempt,
  createUserHistory,
  addUserAttempt,
  deleteUserHistory,
  deleteAllUserHistory,
};
