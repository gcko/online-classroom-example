// eslint-disable-next-line import/prefer-default-export
import { Role, Room } from 'src/types.ts';

export default async function updateAttendance(
  room: Room,
  role: Role,
  entering = true
) {
  const { attendance } = room;
  for (let i = 0; i < attendance.length; i += 1) {
    if (attendance[i].name === role) {
      attendance[i].amount = entering ? 1 : 0;
    }
  }
  const response = await fetch(`/api/rooms/${room.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attendance }),
  });
  return response.json();
}
