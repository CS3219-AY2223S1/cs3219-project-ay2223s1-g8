#!/usr/bin/env node
/*
The MIT License (MIT)

Copyright (c) 2019 Kevin Jahns <kevin.jahns@protonmail.com>.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * @type {any}
 */
 const WebSocket = require('ws')
 const http = require('http')
 const wss = new WebSocket.Server({ noServer: true })
 const setupWSConnection = require('./utils.js').setupWSConnection
 
 const host = 'localhost';
 const port = 8006;
 
 const server = http.createServer((request, response) => {
  // const headers = {
  //   'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
  //   'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  //   'Access-Control-Max-Age': 2592000, // 30 days
  //   /** add other headers as per requirement */
  // };
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
 })
 
 wss.on('connection', setupWSConnection)
 
 server.on('upgrade', (request, socket, head) => {
   // You may check auth of request here..
   // See https://github.com/websockets/ws#client-authentication
   /**
    * @param {any} ws
    */
   const handleAuth = ws => {
     wss.emit('connection', ws, request)
   }
   wss.handleUpgrade(request, socket, head, handleAuth)
 })
 
 server.listen(port, host, () => {
   console.log(`running at '${host}' on port ${port}`)
 })