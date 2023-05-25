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

export { Attendance, Room, Role };
