const express = require('express')
const app = express()
const http = require('http')
let server = http.createServer(app)
const socket = require('socket.io')(server, {
    cors: {
      origin: "*",
    },
});


socket.on('connection', (socketConn) => {
    console.log(socketConn.id)
    socket.on("Start_match", (data) => {
        console.log(data)
    })
})

server.listen(5000, () => {
    console.log("Server is up and running at port: 5000")
})