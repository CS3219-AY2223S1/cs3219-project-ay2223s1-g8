class DuplicateUsernameError extends Error {
  constructor(message = "DuplicateUsernameError") {
    super(message);
    this.name = "DuplicateUsernameError";
    this.statusCode = 409;
  }
}

class InvalidUserError extends Error {
  constructor(message = "InvalidUserError") {
    super(message);
    this.name = "InvalidUserError";
    this.statusCode = 400;
  }
}

class PasswordUnchangedError extends Error {
  constructor(message = "PasswordUnchangedError") {
    super(message);
    this.name = "PasswordUnchangedError";
    this.statusCode = 400;
  }
}

module.exports = {
  DuplicateUsernameError,
  InvalidUserError,
  PasswordUnchangedError,
};