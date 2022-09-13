class DuplicateMatchPotentialError extends Error {
    constructor(message = "DuplicateMatchPotentialError") {
        super(message);
        this.name = "DuplicateMatchPotentialError";
        this.statusCode = 409;
    }
}

class InvalidMatchPotentialError extends Error {
    constructor(message = "InvalidMatchPotentialError") {
        super(message);
        this.name = "InvalidMatchPotentialError";
        this.statusCode = 404;
    }
}

class NoMatchPotentialError extends Error {
    constructor(message = "NoMatchPotentialError") {
        super(message);
        this.name = "NoMatchPotentialError";
        this.statusCode = 404;
    }
}

class DuplicateMatchedError extends Error {
    constructor(message = "DuplicateMatchedError") {
        super(message);
        this.name = "DuplicateMatchedError";
        this.statusCode = 409;
    }
}

class NoMatchedError extends Error {
    constructor(message = "NoMatchedError") {
        super(message);
        this.name = "NoMatchedError";
        this.statusCode = 404;
    }
}

module.exports = {
    DuplicateMatchPotentialError,
    InvalidMatchPotentialError,
    NoMatchPotentialError,
    DuplicateMatchedError,
    NoMatchedError,
}