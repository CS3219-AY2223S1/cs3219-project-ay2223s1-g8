const createUserModel = require("./user-model");
const User = createUserModel();
const { DbDuplicateUsernameError, DbInvalidUserError } = require("../errors");

async function createUser(username, password) {
  await User.sync();
  const conflictingUser = await User.findOne({ where: { username } });
  if (conflictingUser != null) {
    throw new DbDuplicateUsernameError();
  }
  return await User.create({ username, password });
}

async function getUser(username) {
  const user = await User.findOne({ where: { username } });
  if (user === null) {
    throw new DbInvalidUserError();
  }
  return user;
}

async function getUserById(userId) {
  const user = await User.findOne({ where: { userId } });
  if (user === null) {
    throw new DbInvalidUserError();
  }
  return user;
}

async function updateUserById(userId, newPassword) {
  const user = await User.findOne({
    where: { userId },
  });
  if (user === null) {
    throw new DbInvalidUserError();
  }
  return await User.update(
    { password: newPassword },
    {
      where: { userId },
    }
  );
}

async function deleteUserById(userId) {
  const user = await User.findOne({
    where: { userId },
  });
  if (user === null) {
    throw new DbInvalidUserError();
  }
  await User.destroy({ where: { userId } });
  return true;
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
