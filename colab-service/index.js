const log = console.log // initialize http server, socket.io and port number
const http = require('http').createServer()
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const port = 9000
http.listen(port, () => log(`server listening on port: ${port}`))
io.on('connection', (socket) => {
    log(socket.handshake.query.roomId)
    // log(socket.adapter.rooms)
    const roomId = socket.handshake.query.roomId;
    socket.join(roomId);
    socket.on('to server', (evt) => {
      console.log(socket.adapter.rooms);
        log(evt)
        log(evt["roomId"])
        socket.to(evt["roomId"]).emit("to client", { message: evt["message"], roomId: roomId });
    })
})
io.on('disconnect', (evt) => {
    log('some people left')
})
