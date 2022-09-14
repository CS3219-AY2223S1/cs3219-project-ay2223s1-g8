const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("./db-interaction");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const { DbInvalidUserError } = require("../errors");
require("dotenv/config");

async function ormCreateUser(username, password) {
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
}

async function ormGetUser(username, password) {
  const user = await getUser(username);
  if (
    user === null ||
    !(await bcrypt.compare(password, user.dataValues.password))
  ) {
    throw new DbInvalidUserError();
  }
  const token = jwt.sign({ username }, process.env.TOKEN_KEY, {
    expiresIn: "2h",
  });
  const res = {
    username: user.dataValues.username,
    token,
  };
  return res;
}

async function ormUpdateUser(token, currPassword, newPassword) {
  const username = jwtDecode(token).username;
  const user = await getUser(username);
  if (
    user === null ||
    !(await bcrypt.compare(currPassword, user.dataValues.password))
  ) {
    throw new DbInvalidUserError();
  }
  const saltRounds = 10;
  const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);
  return updateUser(username, encryptedPassword);
}

async function ormDeleteUser(token) {
  const username = jwtDecode(token).username;
  const user = await getUser(username);
  if (user === null) {
    throw new DbInvalidUserError();
  }
  return await deleteUser(username);
}

module.exports = {
  ormCreateUser,
  ormGetUser,
  ormUpdateUser,
  ormDeleteUser,
};
