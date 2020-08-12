// eslint-disable-next-line import/prefer-default-export
export async function updateAttendance(room, role, entering = true) {
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
  const json = await response.json();
  return json;
}
