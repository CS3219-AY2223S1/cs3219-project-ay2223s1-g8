const express = require('express');
const cors = require('cors');
const http = require('http');
const database = require('./database');

const config = require('./config')[process.env.NODE_ENV || 'development'];

config.postgres.client = database.connectToPostgres();
console.log(config.postgres.client);

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

const MatchController = require('./controller/matchController');
const matchController = new MatchController(config.postgres.client);

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});

const httpServer = http.createServer(app)

const port = process.env.PORT || 8001;
httpServer.listen(port);
console.log(`Matching-service listening on port ${port} in ${app.get('env')} mode.`);
