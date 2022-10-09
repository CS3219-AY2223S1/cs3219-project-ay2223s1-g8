const {
  createUserHistory,
  getAllUserHistory,
  getUserHistory,
  getUserAttempt,
  addUserAttempt,
  deleteUserHistory,
  deleteAllUserHistory,
} = require("./db-interaction");
const { NoHistoryFoundError } = require("../errors");

const ormCreateUserHistory = async (uid, attempts) => {
  return await createUserHistory(uid, attempts);
};

const ormGetAllUserHistory = async (uid) => {
  return await getAllUserHistory();
};

const ormGetUserHistory = async (uid) => {
  const history = await getUserHistory(uid);
  if (!history || history.length === 0) {
    throw new NoHistoryFoundError();
  }
  return history;
};

const ormGetUserAttempt = async (uid, qid) => {
  return await getUserAttempt(uid, qid);
};

const ormAddUserAttempt = async (uid, attempt) => {
  return await addUserAttempt(uid, attempt);
};

const ormDeleteUserHistory = async (uid) => {
  const history = await getUserHistory(uid);
  if (!history) {
    throw new NoHistoryFoundError();
  }

  return await deleteUserHistory(uid);
}

const ormDeleteAllUserHistory = async () => {
  return await deleteAllUserHistory();
};

module.exports = {
  ormCreateUserHistory,
  ormGetAllUserHistory,
  ormGetUserHistory,
  ormGetUserAttempt,
  ormAddUserAttempt,
  ormDeleteUserHistory,
  ormDeleteAllUserHistory,
};
