let rooms = {
  11111111: {
    id: '11111111',
    name: 'Javascript 101',
    submissionId: 1,
  },
  ABCDEFGH: {
    id: 'ABCDEFGH',
    name: 'Javascript 201',
  },
};

let submissions = {
  1: {
    id: '1',
    text: 'console.log("I am submitted code")',
    roomId: '11111111',
  },
};

module.exports = {
  rooms,
  submissions,
};
