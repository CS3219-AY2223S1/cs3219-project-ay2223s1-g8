require("dotenv/config");
const app = require("./app");
const mongoose = require("mongoose");
const connectDB = require("./model/database");

connectDB();

const PORT = process.env.PORT || 8003;

mongoose.connection.once("open", () => {
  console.log("Connected to history MongoDB");
  app.listen(PORT, () => console.log(`History-service listening on port ${PORT} in ${app.get("env")} mode.`));
});