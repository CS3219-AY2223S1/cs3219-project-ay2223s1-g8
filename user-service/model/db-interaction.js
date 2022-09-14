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

async function updateUser(username, newPassword) {
  const user = await User.findOne({
    where: { username },
  });
  if (user === null) {
    throw new DbInvalidUserError();
  }
  return await User.update(
    { password: newPassword },
    {
      where: { username },
    }
  );
}

async function deleteUser(username) {
  const user = await User.findOne({
    where: { username },
  });
  if (user === null) {
    throw new DbInvalidUserError();
  }
  await User.destroy({ where: { username } });
  return true;
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
