const matchController = require("../index");
const { MatchState } = require("../utils/match");
const {
  DuplicateMatchPotentialError,
  InvalidMatchPotentialError,
  NoMatchPotentialError,
  DuplicateMatchedError,
  NoMatchedError,
} = require("../utils/errors");
const Mutex = require("async-mutex").Mutex;

async function findMatch(req, socketId) {
  const { userId, difficulty } = req;
  var resp = {};
  const mutex = new Mutex();
  const release = await mutex.acquire();
  try {
    // Check if user has found a match
    const hasFoundMatch = await matchController.checkIsUserMatched(userId);
    if (hasFoundMatch) {
      console.log(`User with userId=${userId} has already found a match`);
      resp.status = MatchState.MatchExists;
      release();
      return resp;
      //return res.status(200).json({ message: "user has found match already" });
    }

    // Check if user is waiting for a match
    const isWaitingMatch = await matchController.hasMatchPotential(userId);
    if (isWaitingMatch) {
      console.log(`User with userId=${userId} is waiting for a match`);
      resp.userId = userId;
      resp.status = MatchState.MatchWaiting;
      release();
      return resp;
      // .status(200)
      //  .json({ message: "user is currently waiting for match" });
      //return resp;
    }

    // Check if user can find a match
    const match = await matchController.findMatchesWhereLevel(difficulty);
    if (match === null) {
      console.log(`User with userId=${userId} was unable to find a match`);
      const waitingMatch = await matchController.createMatchPotential(
        userId,
        difficulty,
        socketId
      );
      resp.status = MatchState.MatchWaiting;
      release();
      return resp;
      //return res.status(200).json({ message: "no match found" });
    } else {
      console.log(`User with userId=${userId} has found a match`);
      const matchedUserId = match.dataValues.userId;
      const matchedUserSocketId = match.dataValues.socketId;
      const removeMatchedUser = await matchController.deleteMatchPotential(
        matchedUserId
      );
      const newMatch = await matchController.createMatched(
        userId,
        matchedUserId,
        difficulty
      );
      resp.status = MatchState.MatchFound;
      resp.matchId = newMatch.dataValues.matchedId;
      resp.matchedUserId = matchedUserId;
      resp.matchedUserSocketId = matchedUserSocketId;
      release();
      return resp;
      //return res.status(200).json({ message: "match found" });
    }
  } catch (err) {
    if (err instanceof DuplicateMatchPotentialError) {
      console.log(err);
      release();
    } else if (err instanceof InvalidMatchPotentialError) {
      console.log(err);
      release();
    } else if (err instanceof DuplicateMatchedError) {
      console.log(err);
      release();
    }
    console.log(err);
    release();
    //return res.status(400);
  }
}

async function cancelMatch(req) {
  const mutex = new Mutex();
  const release = await mutex.acquire();
  var resp = {};
  const { userId } = req;
  try {
    // Remove any existing match
    const match = await matchController.findMatchedWhereUserId(userId);
    if (match !== null) {
      const matchedId = match.dataValues.matchedId;
      const removeMatched = await matchController.removeMatched(matchedId);
    }

    // Remove any waiting matches
    const deleteMatchPotential = await matchController.deleteMatchPotential(
      userId
    );
    resp.status = MatchState.MatchedCancelled;
    release();
    return resp;
  } catch (err) {
    if (err instanceof NoMatchedError) {
      console.log(err);
      release();
    } else if (err instanceof InvalidMatchPotentialError) {
      console.log(err);
      release();
    }
    console.log(err);
    release();
  }
}

module.exports = {
  findMatch,
  cancelMatch,
};
