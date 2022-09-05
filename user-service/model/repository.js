const createUserModel = require("./user-model");
const User = createUserModel();
const { DuplicateUsernameError, InvalidUserError } = require("../errors");

async function createUser(username, password) {
  await User.sync();
  const conflictingUser = await User.findOne({ where: { username } });
  if (conflictingUser != null) {
    throw new DuplicateUsernameError();
  }
  return await User.create({ username, password });
}

async function getUser(username) {
  const user = await User.findOne({ where: { username } });
  if (user === null) {
    throw new InvalidUserError();
  }
  return user;
}

async function updateUser(username, newPassword) {
  const user = await User.findOne({
    where: { username },
  });
  if (user === null) {
    throw new InvalidUserError();
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
    throw new InvalidUserError();
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
