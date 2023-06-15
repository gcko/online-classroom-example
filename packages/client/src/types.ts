type Role = 'instructor' | 'student';
interface Attendance {
  name: Role;
  label: string;
  amount: number;
}
interface Room {
  id: number;
  name: string;
  submissionId: number;
  attendance: Attendance[];
}
interface Submission {
  id: string;
  text: string;
  roomId: string;
}

export { Attendance, Room, Role, Submission };
