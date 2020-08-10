const bodyParser = require('body-parser');
const app = require('express')();
const models = require('./models');
const services = require('./services');

// init services
const { roomService, submissionService } = services;
roomService();
submissionService();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use((req, res, next) => {
  req.context = {
    models,
  };
  next();
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
  const submission = roomService.getRoomSubmission(roomId);

  if (submission) {
    res.send(submission);
  } else {
    // submission or room doesn't exist
    res.send({});
  }
});

app.put('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const status = roomService.updateRoom(roomId, req.body);

  res.send({ updated: status });
});

app.get('/api/submissions', (req, res) => {
  res.send(submissionService.getSubmissions());
});

app.post('/api/submissions', (req, res) => {
  const { roomId, submission } = req.body;
  const status = submissionService.createOrUpdateSubmission(roomId, submission);

  // simply overwrite any existing submission
  res.send({ created: status });
});

module.exports = app;
