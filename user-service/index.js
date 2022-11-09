const express = require("express");
const cors = require("cors");

const app = express();
module.exports.app = app;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  checkUsername,
} = require("./controller/user-controller.js");

const router = express.Router();

// Controller will contain all the User-defined Routes
app.get("/", (req, res) => res.send("Ok")); // for liveness check
router.post("/user", createUser);
router.post("/session", getUser);
router.patch("/user", updateUser);
router.delete("/user", deleteUser);
router.post("/username", checkUsername);

app.use("/user-api", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

app.listen(8000, () => console.log("user-service listening on port 8000!"));
