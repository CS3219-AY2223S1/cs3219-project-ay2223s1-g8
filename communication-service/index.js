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

  
});

const port = process.env.PORT || 8005;
httpServer.listen(port);
console.log(
  `Communication-service listening on port ${port} in ${app.get("env")} mode.`
);