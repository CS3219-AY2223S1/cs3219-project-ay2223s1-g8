const express = require("express");


function SocketRouter(io) {
    const router = express.Router();

    router.post("/test", (req, res) => {
        console.log(req)
    })
}