const router = require("express").Router();
const {
  getAllUserHistory,
  deleteAllUserHistory,
  getUserHistory,
  createUserHistory,
  deleteUserHistory,
  getUserAttempt,
  addUserAttempt,
} = require("../controller/history-controller");

router.get("/all", getAllUserHistory);
router.delete("/all", deleteAllUserHistory);

router.get("/", getUserHistory);
router.post("/", createUserHistory);
router.delete("/", deleteUserHistory);

router.get("/attempt", getUserAttempt);
router.post("/attempt", addUserAttempt);

module.exports = router;