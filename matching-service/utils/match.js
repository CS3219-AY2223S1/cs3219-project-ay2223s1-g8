const { v4: uuidv4 } = require("uuid");

const MatchState = {
  MatchFound: "Match Found",
  MatchNotFound: "Match Not Found",
  MatchWaiting: "Match Waiting",
  MatchExists: "Match Already Exists",
  MatchedCancelled: "Match Cancelled",
};

// Generate unique match id
function generateMatchId() {
  return uuidv4();
}

module.exports = {
  MatchState,
  generateMatchId,
};
