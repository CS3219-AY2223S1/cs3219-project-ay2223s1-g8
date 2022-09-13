const { findOneMatchPotential } = require("../index");
const matchController = require("../index");
const {
  DuplicateMatchPotentialError,
  InvalidMatchPotentialError,
  NoMatchPotentialError,
} = require("../utils/errors");

async function createMatch(req, res) {
  const { userId, level } = req.body;
  try {
    if (userId) {
      const resp = await matchController.createMatchPotential(userId, level);
      var matchedId = null;
      const interval = setInterval(async () => {
        console.log(1);
        // Have a new table for deletedMatches: add entry when deleteMatch api is called, then over here check table and if deleted, return res
        // User 1 start searching, followed by user 2. User 2 found match (user 1), remove user 1, then user 1 fail check here
        // When a user's match potential entry is missing, there are 2 possible causes: delete api called or another user found this user (we wont know)
        //const test = await matchController.findOneMatchPotential(userId);
        if (true) {
          clearInterval(interval);
        }
        const waitForMatch = async () => {
          const match = await matchController.findMatchesWhereLevel(
            userId,
            level,
            resp.dataValues.createdAt
          );
          return match;
        };

        const match = await waitForMatch();

        if (match != null) {
          // Matched user found
          matchedId = match.dataValues.userId;
          clearInterval(interval);
          await matchController.deleteMatchPotential(matchedId);
          return res.status(200).json({ matched: true, matchedId: matchedId });
        }
      }, 5 * 1000); // Find a match every 5 seconds

      await new Promise((resolve) => setTimeout(resolve, 30 * 1000)); // Allow matching for 30 seconds
      clearInterval(interval);
      console.log("END");
      if (matchedId == null) {
        await matchController.deleteMatchPotential(userId);
        return res.status(404).json({ matched: false });
      }
    } else {
      return res
        .status(500)
        .json({ message: "User ID not detected in request body" });
    }
  } catch (err) {
    if (err instanceof DuplicateMatchPotentialError) {
      return res.status(409).json({ message: "Duplicate user Id detected" });
    } else if (err instanceof InvalidMatchPotentialError) {
      return res
        .status(500)
        .json({ message: "Invalid match potential detected" });
    } else {
      return res
        .status(500)
        .json({ message: "Database failure when finding match" });
    }
  }
}

async function deleteMatch(req, res) {
  try {
    const { userId } = req.body;
    if (userId) {
      const deleted = await matchController.deleteMatchPotential(userId);
      if (deleted) {
        return res
          .status(200)
          .json({ messsage: "Deleted match potential successfully" });
      }
    } else {
      return res
        .status(500)
        .json({ message: "User ID not detected in request body" });
    }
  } catch (err) {
    if (err instanceof InvalidMatchPotentialError) {
      return res
        .status(500)
        .json({ message: "Invalid match potential detected" });
    } else {
      return res
        .status(500)
        .json({ message: "Database failure when deleting match potential" });
    }
  }
}

module.exports = {
  createMatch,
  deleteMatch,
};
