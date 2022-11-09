class DbDuplicateUsernameError extends Error {
  constructor(message = "DbDuplicateUsernameError") {
    super(message);
    this.name = "DbDuplicateUsernameError";
    this.statusCode = 409;
  }
}

class DbInvalidUserError extends Error {
  constructor(message = "DbInvalidUserError") {
    super(message);
    this.name = "DbInvalidUserError";
    this.statusCode = 400;
  }
}

class PasswordUnchangedError extends Error {
  constructor(message = "DbPasswordUnchangedError") {
    super(message);
    this.name = "DbPasswordUnchangedError";
    this.statusCode = 400;
  }
}

class ValidationError extends Error {
  constructor(message = "ValidationError") {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

module.exports = {
  DbDuplicateUsernameError,
  DbInvalidUserError,
  PasswordUnchangedError,
  ValidationError,
};
