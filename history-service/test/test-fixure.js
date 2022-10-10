const validUserHistory1 = {
  uid: "user-1",
  attempts: [
    {
      qid: "question-1",
      content: `console.log("Hello world!");`
    },
    {
      qid: "question-2",
      content: `console.log("My name is John Doe!");`
    }
  ]
}

const validUserHistory2 = {
  uid: "user-2",
  attempts: [
    {
      qid: "question-3",
      content: `import React from 'react';`
    }
  ]
}

const validUserHistory3_emptyAttemptsArray = {
  uid: "user-3",
  attempts: []
}

const validAddAttemptRequest = {
  uid: "user-1",
  attempt: {
    qid: "question-1",
    content: `// NEW ATTEMPT console.log("HELLO WORLD!");`
  }
}

const validGetUserHistoryRequest = {
  uid: "user-1"
}

const validDeleteUserHistoryRequest = {
  uid: "user-1"
}

const invalidUserAttempts_missingContent = {
  uid: "user-1",
  attempts: [
    {
      qid: "question-1",
    }
  ]
}

const invalidUserAttempts_missingQid = {
  uid: "user-1",
  attempts: [
    {
      content: `console.log("Hello world!");`
    }
  ]
}

const invalidAddAttemptRequest_missingQid = {
  uid: "user-1",
  attempt: {
    content: `// NEW ATTEMPT console.log("HELLO WORLD!");`
  }
}

const invalidAddAttemptRequest_missingContext = {
  uid: "user-1",
  attempt: {
    qid: "question-1"
  }
}

module.exports = {
  validUserHistory1,
  validUserHistory2,
  validUserHistory3_emptyAttemptsArray,
  validAddAttemptRequest,
  validGetUserHistoryRequest,
  validDeleteUserHistoryRequest,
  invalidUserAttempts_missingContent,
  invalidUserAttempts_missingQid,
  invalidAddAttemptRequest_missingQid,
  invalidAddAttemptRequest_missingContext,
};
