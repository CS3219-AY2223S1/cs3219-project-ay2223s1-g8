require("dotenv/config");

const createUserModel = require("./user-model");
const User = createUserModel();
const { DuplicateUsernameError, InvalidUserError } = require("../errors");

async function createUser(username, password) {
  await User.sync();
  const conflictingUser = await User.findOne({ where: { username } });
  if (conflictingUser != null) {
    return { err: new DuplicateUsernameError() };
  }
  return await User.create({ username, password });
}

async function getUser(username, password) {
  const user = await User.findOne({ where: { username, password } });
  if (user === null) {
    return { err: new InvalidUserError() };
  }
  return user;
}

async function updateUser(username, currPassword, newPassword) {
  const user = await User.findOne({
    where: { username, password: currPassword },
  });
  if (user === null) {
    return { err: new InvalidUserError() };
  }
  const [numRowsUpdated] = await User.update(
    { password: newPassword },
    {
      where: { username, password: currPassword },
    }
  );
  if (numRowsUpdated === 1 && currPassword === newPassword) {
    return false;
  }
  return true;
}

async function deleteUser(username, password) {
  const user = await User.findOne({
    where: { username, password },
  });
  if (user === null) {
    return { err: new InvalidUserError() };
  }
  await User.destroy({ where: { username, password } });
  return true;
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
