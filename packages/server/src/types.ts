interface Rooms {
  [index: string]: Room;
}

interface Room {
  submissionId?: string;
  submission?: string;
  name: string;
  id: string;
  attendance: Attendance[];
}

interface Attendance {
  amount: number;
  name: 'student' | 'instructor';
  label: 'Student' | 'Instructor';
}

interface Submissions {
  [index: string]: Submission;
}

interface Submission {
  id: string;
  text: string;
  roomId: string;
}

export { Rooms, Room, Attendance, Submissions, Submission };
