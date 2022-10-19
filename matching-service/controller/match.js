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
  console.log(req);
  let { userId, difficulty } = req;
  var resp = {};
  const mutex = new Mutex();
  const release = await mutex.acquire();
  try {
    const hasFoundMatch = await matchController.checkIsUserMatched(userId);
    if (hasFoundMatch) {
      resp.status = MatchState.MatchExists;
      release();
      return resp;
    }

    const isWaitingMatch = await matchController.hasMatchPotential(userId);
    if (isWaitingMatch) {
      resp.status = MatchState.MatchWaiting;
      release();
      return resp;
    }

    const match = await matchController.findMatchesWhereLevel(difficulty);
    if (match === null) {
      const waitingMatch = await matchController.createMatchPotential(
        userId,
        difficulty,
        socketId
      );
      resp.status = MatchState.MatchWaiting;
      release();
      return resp;
    } else {
      const matchedUserId = match.dataValues.userId;
      const matchedUserSocketId = match.dataValues.socketId;
      const removeMatchedUser = await matchController.deleteMatchPotential(
        matchedUserId
      );
      if (difficulty == "any") {
        difficulty = match.dataValues.level;
      }
      const newMatch = await matchController.createMatched(
        userId,
        matchedUserId,
        difficulty,
        socketId,
        matchedUserSocketId
      );
      resp.status = MatchState.MatchFound;
      resp.roomId = newMatch.dataValues.matchedId;
      resp.matchedUserId = matchedUserId;
      resp.matchedUserSocketId = matchedUserSocketId;
      release();
      return resp;
    }
  } catch (err) {
    console.log(err);
    resp.error = err.message;
    release();
    return resp;
  }
}

async function cancelMatch(req) {
  const mutex = new Mutex();
  const release = await mutex.acquire();
  var resp = {};
  const { userId } = req;
  try {
    const deleteMatchPotential = await matchController.deleteMatchPotential(
      userId
    );
    const match = await matchController.findMatchedWhereUserId(userId);
    if (match !== null) {
      const matchedId = match.dataValues.matchedId;
      const removeMatched = await matchController.removeMatchedByMatchId(
        matchedId
      );
    }
    resp.status = MatchState.MatchCancelled;
    release();
    return resp;
  } catch (err) {
    if (err instanceof NoMatchedError) {
      console.log(err);
      resp.status = MatchState.MatchCancelled;
      release();
      return resp;
    } else if (err instanceof InvalidMatchPotentialError) {
      console.log(err.message);
      resp.status = MatchState.MatchCancelled;
      release();
      return resp;
    }
    console.log(err);
    release();
    resp.error = err.message;
    return resp;
  }
}

async function leaveMatchRoom(req) {
  console.log("LeaveMatchRoom: " + req);
  const mutex = new Mutex();
  const release = await mutex.acquire();
  var resp = {};
  const socketId = req;
  try {
    const deleteMatchedBySocket = await matchController.removeMatchedBySocketId(
      socketId
    );
    resp.status = MatchState.MatchDeleted;
    release();
    return resp;
  } catch (err) {
    if (err instanceof NoMatchedError) {
      console.log(err);
      resp.status = MatchState.MatchDeleted;
      release();
      return resp;
    }
    console.log(err);
    release();
    resp.error = err.message;
    return resp;
  }
}

module.exports = {
  findMatch,
  cancelMatch,
  leaveMatchRoom,
};
