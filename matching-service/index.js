const express = require("express");
const cors = require("cors");
const http = require("http");
const database = require("./database");

const config = require("./config")[process.env.NODE_ENV || "development"];

config.postgres.client = database.connectToPostgres();
console.log(config.postgres.client);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const MatchController = require("./controller/matchController");
module.exports = new MatchController(config.postgres.client);

app.get("/", (req, res) => {
  res.send("Hello World from matching-service");
});

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log(`SocketIO connection created, socketID=${socket.id}`);

  // Handle match event
  socket.on("find match", (req) => {
    console.log(`User socketID=${socket.id} finding match`);
    findMatch(req, socket.id).then((resp) => {
      console.log(resp);
      if (resp.status == "Match Found") {
        socket.join(resp.matchId);
        io.sockets.sockets.get(resp.matchedUserSocketId).join(resp.matchId);
        io.to(resp.matchId).emit("match found", resp);
        // new
        socket.rooms.forEach((roomId) => {
          console.log(roomId);
        });
      } else {
        socket.emit("waiting match", resp);
      }
    });
  });

  // Handle cancel match event
  socket.on("cancel match", (req) => {
    console.log(`User socketID=${socket.id} cancel match`);
    // Cancels any existing match and all waiting matches
    cancelMatch(req).then((resp) => {
      socket.rooms.forEach((matchId) => {
        // Leave all rooms except for default room
        console.log(matchId);
        if (matchId != socket.id) {
          console.log("HERE");
          io.to(matchId).emit("match cancelled", resp);
          io.socketsLeave(matchId); // Remove all sockets from matched rooms
        }
      });
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`User socketID=${socket.id} disconnected, reason=${reason}`);
  });
});

const { findMatch, cancelMatch } = require("./controller/match");

const router = express.Router();
router.post("/", findMatch);
router.delete("/", cancelMatch);
app.use("/api/match", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

const port = process.env.PORT || 8001;
httpServer.listen(port);
console.log(
  `Matching-service listening on port ${port} in ${app.get("env")} mode.`
);
