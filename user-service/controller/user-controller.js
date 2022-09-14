const {
  DuplicateUsernameError,
  PasswordUnchangedError,
  InvalidUserError,
} = require("../errors.js");
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
        return res.status(201).json(resp);
      }
    } else {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    }
  } catch (err) {
    console.log(err);
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
      if (!resp) {
        return res.status(400).json({ message: "Incorrect password!" });
      } else if (resp.err) {
        return res.status(400).json({ message: "Incorrect username!" });
      } else {
        console.log(`Fetched user ${username} successfully!`);
        return res.status(200).json(resp);
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
    const { token, currPassword, newPassword } = req.body;
    if (token && currPassword && newPassword) {
      const resp = await ormUpdateUser(token, currPassword, newPassword);
      console.log(resp);
      if (resp.err) {
        if (resp.err instanceof PasswordUnchangedError) {
          return res.status(202).json({ message: "Password unchanged" });
        } else if (resp.err instanceof InvalidUserError) {
          return res
            .status(400)
            .json({ message: "Invalid username or password!" });
        }
        return res.status(400).json({ message: "Could not update user!" });
      } else {
        console.log(`Password for user updated successfully!`);
        return res.status(200).json({
          message: `Password for user updated successfully!`,
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
    const { token } = req.body;
    if (token) {
      const resp = await ormDeleteUser(token);
      console.log(resp);
      if (resp.err) {
        return res.status(400).json({ message: "Username invalid!" });
      } else {
        console.log(`Deleted user successfully!`);
        return res.status(200).json({ message: `Deleted user successfully!` });
      }
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
