const bodyParser = require('body-parser');
const WebSocket = require('ws');
const app = require('express')();
const models = require('./models');
const { RoomService, SubmissionService } = require('./services');

const { rooms, submissions } = models;
// init services

const roomService = new RoomService(rooms, submissions);
const submissionService = new SubmissionService(submissions, rooms);

app.use((req, res, next) => {
  req.context = {
    models,
  };
  next();
});

// Initialize the Websocket server
const wss = new WebSocket.Server({ port: 3334 });

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

// eslint-disable-next-line no-unused-vars
wss.on('connection', function connection(ws, req) {
  // eslint-disable-next-line no-param-reassign
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  // Event Handlers for model updates
  function handleSubmission(submission) {
    const msg = {
      event: 'change:submission',
      data: submission,
    };
    ws.send(JSON.stringify(msg));
  }
  function handleAttendance(room) {
    const msg = {
      event: 'change:attendance',
      data: room,
    };
    ws.send(JSON.stringify(msg));
  }
  submissionService.on('change:submission', handleSubmission);
  roomService.on('change:attendance', handleAttendance);
});

// Terminate connections that are no longer alive
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    // eslint-disable-next-line no-param-reassign
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 5000);

wss.on('close', function close() {
  clearInterval(interval);
});

// // Add HTTP status to error messages
// function error(status, msg) {
//   var err = new Error(msg);
//   err.status = status;
//   return err;
// }

app.use(bodyParser.json());

app.get('/api', (req, res) => res.send({ version: '0.1' }));

// Rooms
app.get('/api/rooms', (req, res) => {
  res.send(roomService.getRooms());
});

app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = roomService.getRoom(roomId);

  if (room) {
    res.send(room);
  } else {
    // Room didn't exist
    res.send({});
  }
});

app.get('/api/rooms/:roomId/submission', (req, res) => {
  const { roomId } = req.params;
  // const room = roomService.getRoom(roomId);
  const submission = roomService.getRoomSubmission(roomId, submissionService);

  if (submission) {
    res.send(submission);
  } else {
    // submission or room doesn't exist
    res.send({});
  }
});

app.put('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const status = roomService.updateRoom(roomId, req.body, submissionService);

  res.send({ updated: status });
});

app.get('/api/submissions', (req, res) => {
  res.send(submissionService.getSubmissions());
});

app.post('/api/submissions', (req, res) => {
  const { roomId, submission } = req.body;
  const status = submissionService.createOrUpdateSubmission(
    roomId,
    submission,
    roomService
  );

  // simply overwrite any existing submission
  res.send({ created: status });
});

module.exports = app;
