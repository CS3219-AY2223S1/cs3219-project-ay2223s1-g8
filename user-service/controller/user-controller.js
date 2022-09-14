const {
  DbDuplicateUsernameError,
  PasswordUnchangedError,
  DbInvalidUserError,
  ValidationError,
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

    if (!username || !password) {
      throw new ValidationError();
    }

    const resp = await ormCreateUser(username, password);
    console.log(`Created new user ${username} successfully!`);
    return res.status(201).json(resp);
  } catch (err) {
    if (err instanceof DbDuplicateUsernameError) {
      return res.status(409).json({ message: "Duplicate username detected!" });
    } else if (err instanceof ValidationError) {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    } else {
      return res
        .status(500)
        .json({ message: "Database failure when creating new user!" });
    }
  }
}

async function getUser(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ValidationError();
    }

    const resp = await ormGetUser(username, password);
    console.log(`Fetched user ${username} successfully!`);
    return res.status(200).json(resp);
  } catch (err) {
    if (err instanceof DbInvalidUserError) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password!" });
    } else if (err instanceof ValidationError) {
      return res
        .status(400)
        .json({ message: "Username and/or Password are missing!" });
    } else {
      return res
        .status(500)
        .json({ message: "Database failure when creating new user!" });
    }
  }
}
async function updateUser(req, res) {
  try {
    const { token, currPassword, newPassword } = req.body;

    if (!token || !currPassword || !newPassword) {
      throw new ValidationError();
    }
    if (currPassword === newPassword) {
      throw new PasswordUnchangedError();
    }

    await ormUpdateUser(token, currPassword, newPassword);
    console.log(`Password for user updated successfully!`);
    return res.status(200).json({
      message: `Password for user updated successfully!`,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res
        .status(400)
        .json({ message: "Token and/or Passwords are missing!" });
    } else if (err instanceof PasswordUnchangedError) {
      return res.status(202).json({ message: "Password unchanged" });
    } else if (err instanceof DbInvalidUserError) {
      return res.status(400).json({ message: "Incorrect token or password!" });
    } else {
      return res
        .status(500)
        .json({ message: "Database failure when updating user!" });
    }
  }
}

async function deleteUser(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      throw new ValidationError();
    }

    await ormDeleteUser(token);
    console.log(`Deleted user successfully!`);
    return res.status(200).json({ message: `Deleted user successfully!` });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ message: "Token is missing!" });
    } else if (err instanceof DbInvalidUserError) {
      return res.status(400).json({ message: "Incorrect token!" });
    } else {
      return res
        .status(500)
        .json({ message: "Database failure when deleting user!" });
    }
  }
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
