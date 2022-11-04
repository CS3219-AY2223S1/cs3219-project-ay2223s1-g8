const {
  createUserHistory,
  getAllUserHistory,
  getUserHistory,
  getUserAttempt,
  addUserAttempt,
  deleteUserHistory,
  deleteAllUserHistory,
} = require("./db-interaction");

const ormCreateUserHistory = async (uid, attempts) => {
  return await createUserHistory(uid, attempts);
};

const ormGetAllUserHistory = async (uid) => {
  return await getAllUserHistory();
};

const ormGetUserHistory = async (uid) => {
  const userHistory = await getUserHistory(uid);
  const sortedAttempts = userHistory.attempts.sort((a1, a2) =>
    (a1.attemptDate < a2.attemptDate) 
    ? 1 
    : (a1.attemptDate > a2.attemptDate) 
      ? -1 
      : 0
  );
  return { uid: userHistory.uid, attempts: sortedAttempts };
};

const ormGetUserAttempt = async (uid, qid) => {
  return await getUserAttempt(uid, qid);
};

const ormAddUserAttempt = async (uid, attempt) => {
  return await addUserAttempt(uid, attempt);
};

const ormDeleteUserHistory = async (uid) => {
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
