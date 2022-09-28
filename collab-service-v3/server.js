const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8003});
const sockets = new Map();


wss.on("connection", (ws) => {
    console.log(ws);
    // const color = randomColor();
    // sockets.set(ws, color);

    // ws.on("join room", (data) => {

    // })
});