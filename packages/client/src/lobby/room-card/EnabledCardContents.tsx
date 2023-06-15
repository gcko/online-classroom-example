import React, { useEffect, useState } from 'react';
import pluralize from 'pluralize';
import { Role, Room } from 'src/types.ts';
import WaitingArea from 'src/lobby/WaitingArea.tsx';
import socket from 'src/socket.ts';

type Props = {
  room: Room;
  role: Role;
};
function EnabledCardContents({ room, role }: Props) {
  const [theRoom, setTheRoom] = useState(room);

  useEffect(() => {
    socket.on('change:attendance', setTheRoom);
    return function cleanup() {
      socket.off('change:attendance', setTheRoom);
    };
  }, []);

  return (
    <div className="card-body row align-items-center">
      <div className="card-text col-10 mb-0">
        <p>{(theRoom || room).name}</p>
        {(theRoom || room).attendance.map((attendee) => (
          <small key={attendee.name} className="d-block">
            {attendee.amount}{' '}
            {pluralize(attendee.label, parseInt(String(attendee.amount), 10))}
          </small>
        ))}
      </div>
      <WaitingArea room={theRoom || room} role={role} />
    </div>
  );
}

export default EnabledCardContents;
