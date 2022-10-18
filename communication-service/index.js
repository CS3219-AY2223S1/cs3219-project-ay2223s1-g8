const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello World from communication-service");
});

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  path: "/communication-api",
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

const Mutex = require("async-mutex").Mutex;

io.on("connection", (socket) => {
  console.log(`SocketIO connection created, socketID=${socket.id}`);

  socket.on("join chat", (req) => {
    console.log(req);
    socket.join(req.roomId);
  });

  socket.on("send message", async (req) => {
    const mutex = new Mutex();
    console.log("SEND MESSAGE");
    const release = await mutex.acquire();
    console.log(req);
    io.to(req.roomId).emit("receive message", req);
    release();
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
