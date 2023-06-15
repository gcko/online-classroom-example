import React from 'react';
import { Role, Room } from 'src/types.ts';
import EnabledCardContents from 'src/lobby/room-card/EnabledCardContents.tsx';
import DisabledCardContents from 'src/lobby/room-card/DisabledCardContents.tsx';

type Props = {
  room: Room;
  role: Role;
  isValid: boolean;
};
function RoomCard({ isValid, room, role }: Props) {
  return (
    <div className="card mt-3">
      {isValid ? (
        <EnabledCardContents room={room} role={role} key={room.id} />
      ) : (
        <DisabledCardContents />
      )}
    </div>
  );
}

export default RoomCard;
