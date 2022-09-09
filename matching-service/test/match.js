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
          matchController.deleteMatchPotential(matchedId);
          return res.status(200).json({ matched: true, matchedId: matchedId });
        }
      }, 5 * 1000); // Find a match every 5 seconds

      await new Promise((resolve) => setTimeout(resolve, 30 * 1000)); // Allow matching for 30 seconds
      clearInterval(interval);
      if (matchedId == null) {
        matchController.deleteMatchPotential(userId);
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
      return res.status(500).json({ message: "Invalid user Id detected" });
    } else if (err instanceof NoMatchPotentialError) {
      console.log("HERE");
      //return res.status(404).json({ matched: false });
    } else {
      return res
        .status(500)
        .json({ message: "Database failure when finding match" });
    }
  }
}

module.exports = {
  createMatch,
};
