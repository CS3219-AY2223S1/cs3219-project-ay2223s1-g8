class ValidationError extends Error {
  constructor(message = "ValidationError") {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class DbDuplicateTitleError extends Error {
  constructor(message = "DbDuplicateTitleError") {
    super(message);
    this.name = "DbDuplicateTitleError";
    this.statusCode = 400;
  }
}

class DbInvalidIdError extends Error {
  constructor(message = "DbInvalidIdError") {
    super(message);
    this.name = "DbInvalidIdError";
    this.statusCode = 400;
  }
}

class DbInvalidDifficultyError extends Error {
  constructor(message = "DbInvalidDifficultyError") {
    super(message);
    this.name = "DbInvalidDifficultyError";
    this.statusCode = 400;
  }
}

class DbNoMatchingQuestionsError extends Error {
  constructor(message = "DbNoMatchingQuestionsError") {
    super(message);
    this.name = "DbNoMatchingQuestionsError";
    this.statusCode = 400;
  }
}

module.exports = {
  ValidationError,
  DbDuplicateTitleError,
  DbInvalidIdError,
  DbInvalidDifficultyError,
  DbNoMatchingQuestionsError,
};
