const createUserModel = require("./user-model");
const User = createUserModel();
const { DuplicateUsernameError, InvalidUserError } = require("../errors");

async function ormCreateUser(username, password) {
  try {
    await User.sync();
    const conflictingUser = await User.findOne({ where: { username } });
    if (conflictingUser != null) {
      return { err: new DuplicateUsernameError() };
    }
    await User.create({ username, password });
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new user");
    return { err };
  }
}

async function ormGetUser(username, password) {
  try {
    const user = await User.findOne({ where: { username, password } });
    if (user === null) {
      return { err: new InvalidUserError() };
    }
    return true;
  } catch (err) {
    console.log("ERROR: Could not fetch user");
    return { err };
  }
}

async function ormUpdateUser(username, currPassword, newPassword) {
  try {
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
  } catch (err) {
    console.log("ERROR: Could not update user");
    return { err };
  }
}

async function ormDeleteUser(username, password) {
  try {
    const user = await User.findOne({
      where: { username, password },
    });
    if (user === null) {
      return { err: new InvalidUserError() };
    }
    await User.destroy({ where: { username, password } });
    return true;
  } catch (err) {
    console.log("ERROR: Could not delete user");
    return { err };
  }
}

module.exports = {
  ormCreateUser,
  ormGetUser,
  ormUpdateUser,
  ormDeleteUser,
};
