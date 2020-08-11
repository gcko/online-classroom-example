const rooms = {
  11111111: {
    id: '11111111',
    name: 'Javascript 101',
    submissionId: 1,
    attendance: [
      {
        name: 'instructor',
        label: 'Instructor',
        amount: 0,
      },
      {
        name: 'student',
        label: 'Student',
        amount: 0,
      },
    ],
  },
  ABCDEFGH: {
    id: 'ABCDEFGH',
    name: 'Javascript 201',
    attendance: [
      {
        name: 'instructor',
        label: 'Instructor',
        amount: 1,
      },
      {
        name: 'student',
        label: 'Student',
        amount: 0,
      },
    ],
  },
  11111112: {
    id: '11111112',
    name: 'Javascript 102',
    attendance: [
      {
        name: 'instructor',
        label: 'Instructor',
        amount: 1,
      },
      {
        name: 'student',
        label: 'Student',
        amount: 1,
      },
    ],
  },
};

const submissions = {
  1: {
    id: '1',
    text: 'console.log("I am submitted code!")',
    roomId: '11111111',
  },
};

module.exports = {
  rooms,
  submissions,
};
