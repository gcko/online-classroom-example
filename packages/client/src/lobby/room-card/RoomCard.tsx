import React from 'react';
import { Role, Room } from 'src/types.ts';
import EnabledCardContents from 'src/lobby/room-card/EnabledCardContents.tsx';
import DisabledCardContents from 'src/lobby/room-card/DisabledCardContents.tsx';

type Props = {
  room: Room;
  role: Role;
  ws: WebSocket;
  isValid: boolean;
};
function RoomCard({ isValid, room, role, ws }: Props) {
  return (
    <div className="card mt-3">
      {isValid ? (
        <EnabledCardContents room={room} role={role} ws={ws} key={room.id} />
      ) : (
        <DisabledCardContents />
      )}
    </div>
  );
}

export default RoomCard;
