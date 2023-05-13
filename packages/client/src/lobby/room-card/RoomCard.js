import React from 'react';
import EnabledCardContents from './EnabledCardContents';
import DisabledCardContents from './DisabledCardContents';

function RoomCard({ isValid, room, role, ws }) {
  return (
    <div className="card mt-3">
      {isValid ? (
        <EnabledCardContents room={room} role={role} ws={ws} key={ws} />
      ) : (
        <DisabledCardContents />
      )}
    </div>
  );
}

export default RoomCard;
