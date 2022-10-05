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

const PORT = process.env.PORT || 8003;

app.listen(PORT, () => console.log(`History-service listening on port ${PORT} in ${app.get("env")} mode.`));
