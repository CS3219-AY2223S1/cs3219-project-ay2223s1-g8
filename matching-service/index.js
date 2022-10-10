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
  path: "/matching-api",
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id + " has connected");
  socket.on("find match", (req) => {
    findMatch(req, socket.id).then((resp) => {
      if (resp.status == "Match Found") {
        socket.join(resp.roomId);
        io.sockets.sockets.get(resp.matchedUserSocketId).join(resp.roomId);
        io.to(resp.roomId).emit("match found", resp);
      } else if (resp.status == "Match Already Exists") {
      } else {
        socket.emit("waiting match", resp);
      }
    });
  });

  socket.on("cancel match", (req) => {
    cancelMatch(req).then((resp) => {
      if (resp.status == "Match Cancelled") {
        console.log("Match successfully cancelled");
      }
      socket.rooms.forEach((roomId) => {
        if (roomId != socket.id) {
          io.to(roomId).emit("match cancelled", resp);
          io.socketsLeave(roomId);
        }
      });
    });
  });

  socket.on("leave room by close tab", (req) => {
    leaveMatchRoom(req).then((resp) => {
      console.log(resp.status);
    });
  });

  socket.on("leave room by button", (req) => {
    leaveMatchRoom(req).then((resp) => {});
    console.log(resp.status);
  });

  socket.on("disconnect", (reason) => {
    console.log(`User socketID=${socket.id} disconnected, reason=${reason}`);
  });
});

const {
  findMatch,
  cancelMatch,
  leaveMatchRoom,
} = require("./controller/match");

const port = process.env.PORT;
httpServer.listen(port);
console.log(
  `Matching-service listening on port ${port} in ${app.get("env")} mode.`
);
