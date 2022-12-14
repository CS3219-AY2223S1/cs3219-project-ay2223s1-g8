const History = require("./history-model");
const {
  NoHistoryFoundError,
  NoAttemptFoundError,
  DuplicateHistoryError,
} = require("../errors");

const createUserHistory = async (uid, attempts = []) => {
  try {
    const existingHistory = await History.findOne({ uid });
    if (existingHistory) {
      throw new DuplicateHistoryError();
    }
    const history = new History({ uid, attempts });
    return await history.save();
  } catch (err) {
    throw err;
  }
};

const getAllUserHistory = async () => {
  return await History.find();
};

const getUserHistory = async (uid) => {
  const history = await History.findOne({ uid });
  if (!history) {
    return createUserHistory(uid);
  }
  return history;
};

const getUserAttempt = async (uid, qid) => {
  const history = await History.findOne({ uid });
  if (!history) {
    throw new NoHistoryFoundError();
  }
  const attempt = history.attempts.find((obj) => obj.qid === qid);
  if (!attempt) {
    throw new NoAttemptFoundError();
  }
  return attempt;
};

const addUserAttempt = async (uid, attempt) => {
  const history = await History.findOne({ uid });

  if (!history) { // create new history
    return await createUserHistory(uid, [attempt]);
  }

  const prevAttempt = history.attempts.find((qnAttempt) => qnAttempt.qid === attempt.qid);

  if (!prevAttempt) {
    history.attempts.push(attempt);
  } else {
    prevAttempt.content = attempt.content;
    prevAttempt.attemptDate = Date.now();
  }

  return await history.save();
}

const deleteUserHistory = async (uid) => {
  const history = await History.findOne({ uid });
  if (!history) {
    throw new NoHistoryFoundError();
  }
  return await History.findOneAndDelete({ uid });
};

const deleteAllUserHistory = async () => {
  return await History.deleteMany({});
};

module.exports = {
  createUserHistory,
  getAllUserHistory,
  getUserHistory,
  getUserAttempt,
  addUserAttempt,
  deleteUserHistory,
  deleteAllUserHistory,
}
