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

async function findMatch(req, res) {
  const { userId, level } = req.body;
  var resp = {};
  const mutex = new Mutex();

  try {
    const release = await mutex.acquire();

    // Check if user has found a match
    const hasFoundMatch = await matchController.checkIsUserMatched(userId);
    if (hasFoundMatch) {
      console.log(`User with userId=${userId} has already found a match`);
      resp.status = MatchState.MatchFound;
      //return resp;
      release();
      console.log(resp);
      return res.status(200).json({ message: "user has found match already" });
    }

    // Check if user is waiting for a match
    const isWaitingMatch = await matchController.hasMatchPotential(userId);
    if (isWaitingMatch) {
      console.log(`User with userId=${userId} is waiting for a match`);
      resp.status = MatchState.MatchWaiting;
      release();
      console.log(resp);
      return res
        .status(200)
        .json({ message: "user is currently waiting for match" });
      //return resp;
    }

    // Check if user can find a match
    const match = await matchController.findMatchesWhereLevel(level);
    if (match === null) {
      console.log(`User with userId=${userId} was unable to find a match`);
      const waitingMatch = await matchController.createMatchPotential(
        userId,
        level
      );
      resp.status = MatchState.MatchWaiting;
      //return resp;
      console.log(resp);
      release();
      return res.status(200).json({ message: "no match found" });
    } else {
      console.log(`User with userId=${userId} has found a match`);
      const matchedUserId = match.dataValues.userId;
      const removeMatchedUser = await matchController.deleteMatchPotential(
        matchedUserId
      );
      const newMatch = await matchController.createMatched(
        userId,
        matchedUserId,
        level
      );
      resp.status = MatchState.MatchFound;
      resp.matchId = newMatch.dataValues.matchedId;
      resp.matchedUserId = matchedUserId;
      console.log(resp);
      release();
      // return resp;
      return res.status(200).json({ message: "match found" });
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
    return res.status(400);
  }
}

async function cancelMatch(req, res) {
  const mutex = new Mutex();
  const release = await mutex.acquire();
  var resp = {};
  const { userId } = req.body;
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
    release();
    return res.status(200).json({ message: "all matches removed" });
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
    return res.status(400);
  }
}

module.exports = {
  findMatch,
  cancelMatch,
};
