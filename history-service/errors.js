class ValidationError extends Error {
  constructor(message = "ValidationError") {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class DuplicateHistoryError extends Error {
  constructor(message = "DuplicateHistoryError") {
    super(message);
    this.name = "DuplicateHistoryError";
    this.statusCode = 400;
  }
}

class InvalidIdError extends Error {
  constructor(message = "InvalidIdError") {
    super(message);
    this.name = "InvalidIdError";
    this.statusCode = 400;
  }
}

class InvalidAttemptObjError extends Error {
  constructor(message = "InvalidAttemptObjError") {
    super(message);
    this.name = "InvalidAttemptObjError";
    this.statusCode = 400;
  }
}

class NoHistoryFoundError extends Error {
  constructor(message = "NoHistoryFoundError") {
    super(message);
    this.name = "NoHistoryFoundError";
    this.statusCode = 400;
  }
}

class NoAttemptFoundError extends Error {
  constructor(message = "NoAttemptFoundError") {
    super(message);
    this.name = "NoAttemptFoundError";
    this.statusCode = 400;
  }
}

module.exports = {
  ValidationError,
  DuplicateHistoryError,
  InvalidIdError,
  InvalidAttemptObjError,
  NoHistoryFoundError,
  NoAttemptFoundError,
};
