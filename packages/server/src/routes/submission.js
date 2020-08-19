const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.send(req.services.submission.getSubmissions());
});

router.post('/', (req, res) => {
  const { roomId, submission } = req.body;
  const status = req.services.submission.createOrUpdateSubmission(
    roomId,
    submission,
    req.services.room
  );

  // simply overwrite any existing submission
  res.send({ created: status });
});

module.exports = router;
