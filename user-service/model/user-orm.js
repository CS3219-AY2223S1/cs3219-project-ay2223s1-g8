const { createUser, getUser, updateUser, deleteUser } = require("./repository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const { PasswordUnchangedError, InvalidUserError } = require("../errors");
require("dotenv/config");

async function ormCreateUser(username, password) {
  try {
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    const user = await createUser(username, encryptedPassword);
    const token = jwt.sign({ username }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    const res = {
      username: user.dataValues.username,
      token,
    };
    return res;
  } catch (err) {
    console.log("ERROR: Could not create new user");
    return { err };
  }
}

async function ormGetUser(username, password) {
  try {
    const user = await getUser(username);
    if (user && (await bcrypt.compare(password, user.dataValues.password))) {
      const token = jwt.sign({ username }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      const res = {
        username: user.dataValues.username,
        token,
      };
      return res;
    }
    return false;
  } catch (err) {
    console.log("ERROR: Could not fetch user");
    return { err };
  }
}

async function ormUpdateUser(token, currPassword, newPassword) {
  try {
    if (currPassword === newPassword) {
      return { err: new PasswordUnchangedError() };
    }
    const username = jwtDecode(token).username;
    const user = await getUser(username);
    if (
      user &&
      (await bcrypt.compare(currPassword, user.dataValues.password))
    ) {
      const saltRounds = 10;
      const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);
      return updateUser(username, encryptedPassword);
    }
    return { err: new InvalidUserError() };
  } catch (err) {
    console.log("ERROR: Could not update user");
    return { err };
  }
}

async function ormDeleteUser(token) {
  try {
    const username = jwtDecode(token).username;
    return await deleteUser(username);
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
