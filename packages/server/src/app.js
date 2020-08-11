const bodyParser = require('body-parser');
const WebSocket = require('ws');
const app = require('express')();
const models = require('./models');
const { RoomService, SubmissionService } = require('./services');

const { rooms, submissions } = models;
// init services

const roomService = new RoomService(rooms, submissions);
const submissionService = new SubmissionService(submissions, rooms);

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

app.use((req, res, next) => {
  req.context = {
    models,
  };
  next();
});

// Websocket stuff...
const wss = new WebSocket.Server({ port: 3334 });

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', function connection(ws, req) {
  // eslint-disable-next-line no-param-reassign
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  ws.on('message', function incoming(message) {
    if (message.indexOf('connections') > -1) {
      ws.send(`Number of connected clients: ${wss.clients.size}`);
      ws.send(`url: ${req.url}`);
    } else {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`received: ${message}`);
        }
      });
      console.log(`received: ${message} from client`);
    }
  });
  ws.on('close', function closed(code, reason) {
    console.log(`connection was closed: ${code}, ${reason}`);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          `Client closed! Number of connected clients: ${wss.clients.size}`
        );
      }
    });
  });
  ws.send(`Number of connected clients: ${wss.clients.size}`);
  function broadcast(msg) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  }
  broadcast(
    `New client connected! Number of connected clients: ${wss.clients.size}`
  );
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
