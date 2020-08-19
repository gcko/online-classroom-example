const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  return res.send(req.services.room.getRooms());
});

router.get('/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = req.services.room.getRoom(roomId);

  if (room) {
    res.send(room);
  } else {
    // Room didn't exist
    res.send({});
  }
});

router.get('/:roomId/submission', (req, res) => {
  const { roomId } = req.params;
  const submission = req.services.room.getRoomSubmission(
    roomId,
    req.services.submission
  );

  if (submission) {
    res.send(submission);
  } else {
    // submission or room doesn't exist
    res.send({});
  }
});

router.put('/:roomId', (req, res) => {
  const { roomId } = req.params;
  const status = req.services.room.updateRoom(
    roomId,
    req.body,
    req.services.submission
  );

  res.send({ updated: status });
});

router.post('/:roomId/:role/decrement', req => {
  const { roomId, role } = req.params;
  req.services.room.decrementRoleAmount(roomId, role);
  // this is for navigator.sendBeacon;
  // the browser does not listen for a result, do not send a result
});

module.exports = router;
