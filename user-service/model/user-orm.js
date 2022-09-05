const { createUser, getUser, updateUser, deleteUser } = require("./repository");

async function ormCreateUser(username, password) {
  try {
    return createUser(username, password);
  } catch (err) {
    console.log("ERROR: Could not create new user");
    return { err };
  }
}

async function ormGetUser(username, password) {
  try {
    return getUser(username, password);
  } catch (err) {
    console.log("ERROR: Could not fetch user");
    return { err };
  }
}

async function ormUpdateUser(username, currPassword, newPassword) {
  try {
    return updateUser(username, currPassword, newPassword);
  } catch (err) {
    console.log("ERROR: Could not update user");
    return { err };
  }
}

async function ormDeleteUser(username, password) {
  try {
    return deleteUser(username, password);
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
