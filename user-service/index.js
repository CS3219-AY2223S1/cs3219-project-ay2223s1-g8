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
} = require("./controller/user-controller.js");

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get("/", getUser);
router.post("/", createUser);
router.patch("/", updateUser);
router.delete("/", deleteUser);

app.use("/api/user", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

app.listen(8000, () => console.log("user-service listening on port 8000"));
