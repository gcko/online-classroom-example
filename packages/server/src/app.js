const bodyParser = require('body-parser');
const app = require('express')();
const routes = require('./routes');
const models = require('./models');
const {
  RoomService,
  SubmissionService,
  WebsocketService,
} = require('./services');

const { rooms, submissions } = models;

// init services
const roomService = new RoomService(rooms, submissions);
const submissionService = new SubmissionService(submissions, rooms);
// Allow access to the same service instances from the routes
app.use(['/api/rooms', '/api/submissions'], (req, res, next) => {
  req.services = {
    room: roomService,
    submission: submissionService,
  };
  next();
});

// Initialize Websocket server
// eslint-disable-next-line no-unused-vars
const websocketService = new WebsocketService({
  roomService,
  submissionService,
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.redirect(301, '/api');
});

app.use('/api', routes.api);

module.exports = app;
