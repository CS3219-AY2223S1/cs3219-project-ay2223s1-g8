const express = require("express");
const app = express();
const http = require("http");
let server = http.createServer(app);
const socket = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

socket.on("connection", (socketConn) => {
  console.log(socketConn.id);

  socketConn.on("find match", (data) => {
    console.log(data);
    setTimeout(() => {
      socketConn.emit("match found", { roomId: 5 });
    }, 5000);
  });
});

server.listen(5000, () => {
  console.log("Server is up and running at port: 5000");
});