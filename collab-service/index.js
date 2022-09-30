const http = require('http').createServer()
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const port = 8003;
http.listen(port, () => console.log(`server listening on port: ${port}`))
io.on('connection', (socket) => {
  console.log(socket.id + " has connected");
  
  socket.on('join room', (data) => {
    console.log(socket.id + " is trying to join room: " + data["roomId"]);
    const roomId = data["roomId"];
    socket.join(roomId);
    console.log(socket.id + " has joined room " + roomId);
  })

  socket.on('client to server', (data) => {
    console.log(data)
    const roomId = data["roomId"];
    console.log(roomId);
    console.log(socket.adapter.rooms);
    socket.to(roomId).emit("server to client", { message: data["message"], roomId: roomId });
  })
})
io.on('disconnect', (evt) => {
  console.log('some people left')
})
