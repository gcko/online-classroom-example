import React, { useEffect, useRef, useState } from 'react';
import pluralize from 'pluralize';
import WaitingArea from '../WaitingArea';

function EnabledCardContents({ room, role, ws }) {
  const [theRoom, setTheRoom] = useState(room);
  const currentWs = useRef(ws);

  function handleWebsocketMessage(e) {
    try {
      const msg = JSON.parse(e.data);
      if (msg.event === 'change:attendance') {
        // update room
        setTheRoom(msg.data);
      }
    } catch (error) {
      console.warn(`Message was not JSON parsable. resp: ${e.data}`);
      console.warn(`Error: ${error}`);
    }
  }

  useEffect(() => {
    // use a referenced version of the websocket
    if (currentWs.current) {
      currentWs.current.addEventListener('message', handleWebsocketMessage);
    } else {
      console.warn('websocket is not defined');
    }
    return function cleanup() {
      // clean up from previous render
      if (ws !== currentWs.current) {
        currentWs.current.removeEventListener(
          'message',
          handleWebsocketMessage
        );
        currentWs.current = ws;
      }
    };
  });

  return (
    <div className="card-body row align-items-center">
      <div className="card-text col-10 mb-0">
        <p>{(theRoom || room).name}</p>
        {(theRoom || room).attendance.map((attendee) => (
          <small key={attendee.name} className="d-block">
            {attendee.amount}{' '}
            {pluralize(attendee.label, parseInt(attendee.amount, 10))}
          </small>
        ))}
      </div>
      <WaitingArea theRoom={theRoom} room={room} role={role} ws={ws} />
    </div>
  );
}

export default EnabledCardContents;
