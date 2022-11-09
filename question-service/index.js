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
  createQuestionsInBulk,
  getQuestionByDifficulty,
  getAllQuestions,
  deleteQuestion,
  deleteAssignedQuestion,
  getQuestionById,
} = require("./controller/question-controller.js");

const router = express.Router();

// Controller will contain all the Question-related Routes
app.get("/", (req, res) => {
  res.send("Ok");
}); // for health check

router.post("/random-question", getQuestionByDifficulty);
router.post("/question-by-id", getQuestionById);
router.delete("/assigned-question", deleteAssignedQuestion);

// For internal use
router.get("/questions", getAllQuestions);
router.post("/question", createQuestion);
router.post("/questions", createQuestionsInBulk);
router.delete("/question", deleteQuestion);

app.use("/question-api", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

app.listen(8002, () => console.log("question-service listening on port 8002"));
