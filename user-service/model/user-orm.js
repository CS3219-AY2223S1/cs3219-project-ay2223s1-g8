const {
  createUser,
  getUser,
  getUserById,
  updateUserById,
  deleteUserById,
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

  const token = jwt.sign(
    { id: user.dataValues.userId },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  const res = {
    username: user.dataValues.username,
    userId: user.dataValues.userId,
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
  const token = jwt.sign(
    { id: user.dataValues.userId },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  const res = {
    username: user.dataValues.username,
    userId: user.dataValues.userId,
    token,
  };
  return res;
}

async function ormUpdateUser(token, currPassword, newPassword) {
  const userId = jwtDecode(token).id;
  const user = await getUserById(userId);
  if (
    user === null ||
    !(await bcrypt.compare(currPassword, user.dataValues.password))
  ) {
    throw new DbInvalidUserError();
  }
  const saltRounds = 10;
  const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);
  return updateUserById(userId, encryptedPassword);
}

async function ormDeleteUser(token) {
  const userId = jwtDecode(token).id;
  const user = await getUserById(userId);
  if (user === null) {
    throw new DbInvalidUserError();
  }
  return await deleteUserById(userId);
}

module.exports = {
  ormCreateUser,
  ormGetUser,
  ormUpdateUser,
  ormDeleteUser,
};
