const { DuplicateUsernameError } = require("../errors.js");
const {
  ormCreateUser,
  ormGetUser,
  ormUpdateUser,
  ormDeleteUser,
} = require("../model/user-orm.js");

async function createUser(req, res) {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const resp = await ormCreateUser(username, password);
      console.log(resp);
      if (resp.err) {
        console.log(resp.err);
        if (resp.err instanceof DuplicateUsernameError) {
          return res
            .status(409)
            .json({ message: "Duplicate username detected!" });
        }
        return res
          .status(400)
          .json({ message: "Could not create a new user!" });
      } else {
        console.log(`Created new user ${username} successfully!`);
        return res
          .status(201)
          .json({ message: `Created new user ${username} successfully!` });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when creating new user!" });
  }
}
async function getUser(req, res) {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const resp = await ormGetUser(username, password);
      console.log(resp);
      if (resp.err) {
        return res.status(400).json({ message: "Could not fetch user!" });
      } else {
        console.log(`Fetched user ${username} successfully!`);
        return res.status(200).json({ username, password });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when fetching user!" });
  }
}
async function updateUser(req, res) {
  try {
    const { username, currPassword, newPassword } = req.body;
    if (username && currPassword && newPassword) {
      const resp = await ormUpdateUser(username, currPassword, newPassword);
      console.log(resp);
      if (!resp) {
        return res.status(202).json({ message: "Password unchanged" });
      } else if (resp.err) {
        return res.status(400).json({ message: "Could not update user!" });
      } else {
        console.log(`Password for user ${username} updated successfully!`);
        return res.status(200).json({
          message: `Password for user ${username} updated successfully!`,
        });
      }
    } else {
      return res.status(400).json({
        message: "Current password and/or new password are missing!",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when updating user!" });
  }
}
async function deleteUser(req, res) {
  try {
    const { username, password } = req.body;
    if (username) {
      const resp = await ormDeleteUser(username, password);
      console.log(resp);
      if (resp.err) {
        return res.status(400).json({ message: "Could not delete user!" });
      } else {
        console.log(`Deleted user ${username} successfully!`);
        return res
          .status(200)
          .json({ message: `Deleted user ${username} successfully!` });
      }
    } else {
      return res.status(400).json({ message: "Username missing!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when deleting user!" });
  }
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
