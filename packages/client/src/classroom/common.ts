import { Role, Room } from 'src/types.ts';

export default async function updateAttendance(
  room: Room,
  role: Role,
  entering = true
) {
  const attendance = room.attendance.map((item) => {
    if (item.name === role) {
      item.amount = entering ? 1 : 0;
    }
    return item;
  });
  const response = await fetch(`/api/rooms/${room.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attendance }),
  });
  return response.json();
}
