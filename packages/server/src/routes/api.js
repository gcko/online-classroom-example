const { Router } = require('express');
const room = require('./room');
const submission = require('./submission');

const router = Router();

router.get('/', (req, res) => res.send({ version: '0.1' }));

router.use('/rooms', room);
router.use('/submissions', submission);

module.exports = router;
