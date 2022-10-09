require("dotenv/config");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./model/database");

connectDB();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); 
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello world from history-service");
});

const historyRoutes = require("./route/history-routes");

app.use("/api/history", historyRoutes).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

const PORT = process.env.PORT || 8003;

mongoose.connection.once("open", () => {
  console.log("Connected to history MongoDB");
  app.listen(PORT, () => console.log(`History-service listening on port ${PORT} in ${app.get("env")} mode.`));
});
