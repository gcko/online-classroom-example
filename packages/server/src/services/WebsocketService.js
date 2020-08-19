const WebSocket = require('ws');

class WebsocketService {
  constructor(config = {}) {
    const { roomService, submissionService } = config;
    this.isAlive = false; // todo check
    // Initialize the Websocket server
    const wss = new WebSocket.Server({ port: 3334 });
    this.wss = wss;

    function noop() {}

    function heartbeat() {
      this.isAlive = true;
    }

    wss.on('connection', function connection(ws) {
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
  }
}

module.exports = WebsocketService;
