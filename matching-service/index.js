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

<<<<<<< HEAD
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World from matching-service');
})

app.use("/api/match", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
=======
const MatchController = require('./controller/matchController');
const matchController = new MatchController(config.postgres.client);

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
>>>>>>> matching-basic
});

const httpServer = http.createServer(app)

<<<<<<< HEAD
httpServer.listen(8001, () => console.log("matching-service listening on port 8001"));
=======
const port = process.env.PORT || 8001;
httpServer.listen(port);
console.log(`Matching-service listening on port ${port} in ${app.get('env')} mode.`);
>>>>>>> matching-basic
