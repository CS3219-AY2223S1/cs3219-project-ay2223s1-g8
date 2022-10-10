const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); 
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello world from history-service");
});

const historyRoutes = require("./route/history-routes");

app.use("/history-api/history", historyRoutes).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

module.exports = app;
