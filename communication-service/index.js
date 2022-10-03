const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log(`SocketIO connection created, socketID=${socket.id}`);

  socket.on("join chat", (req) => {
    console.log(req);
    socket.join(req.roomId);
  });

  socket.on("send message", (req) => {
    console.log(req);
    io.to(req.roomId).emit("receive message", req);
  });

  socket.on("disconnect", (reason) => {
    console.log(`User socketID=${socket.id} disconnected, reason=${reason}`);
  });
});

const port = process.env.PORT || 8005;
httpServer.listen(port);
console.log(
  `Communication-service listening on port ${port} in ${app.get("env")} mode.`
);
