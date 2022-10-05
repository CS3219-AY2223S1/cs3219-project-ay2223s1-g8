const express = require("express");
const cors = require("cors");

const app = express();
module.exports.app = app;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const {
  createQuestion,
  getQuestionByDifficulty,
  getAllQuestions,
  deleteQuestion,
} = require("./controller/question-controller.js");

const router = express.Router();

// Controller will contain all the Question-related Routes
router.post("/random-question", getQuestionByDifficulty);
router.get("/questions", getAllQuestions);
router.post("/question", createQuestion);
router.delete("/question", deleteQuestion);

app.use("/question-api", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

app.listen(8002, () => console.log("question-service listening on port 8002"));
