import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  XCircleFill,
  ExclamationCircle,
  ChevronBarRight,
} from 'react-bootstrap-icons';
import pluralize from 'pluralize';
import './Lobby.sass';
import { ROLE_INSTRUCTOR, ROLE_STUDENT } from '../common/constants';

function DisabledCardContents() {
  return (
    <div className="card-body row align-items-center">
      <p className="card-text col-10 mb-0 text-muted">
        Finalize room selection...
      </p>
      <Link
        to="/"
        role="button"
        aria-disabled="true"
        className="btn btn-outline-secondary disabled col-2"
      >
        <XCircleFill />
      </Link>
    </div>
  );
}

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
      // currentWs.current.send('sending from EnabledCardContents :)');
      currentWs.current.addEventListener('message', handleWebsocketMessage);
      // currentWs.current.onmessage = e => {};
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
  }); // See if it works if we only call once...

  function getRoomAttendance() {
    const ARoom = theRoom || room;
    return ARoom.attendance;
  }

  function Tooltip(props) {
    return (
      <div className="tooltip fade bs-tooltip-right show" role="tooltip">
        <div className="arrow" />
        <div className="tooltip-inner">{props.children}</div>
      </div>
    );
  }

  function isRoleFull(attendee = role) {
    const attendance = getRoomAttendance();
    for (let i = 0; i < attendance.length; i += 1) {
      if (attendance[i].name === attendee) {
        return attendance[i].amount > 0;
      }
    }
    // the role wasn't found!
    return -1;
  }

  function isClassFull() {
    return isRoleFull(ROLE_STUDENT) && isRoleFull(ROLE_INSTRUCTOR);
  }

  return (
    <div className="card-body row align-items-center">
      <div className="card-text col-10 mb-0">
        <p>{(theRoom || room).name}</p>
        {getRoomAttendance().map(attendee => {
          return (
            <small key={attendee.name} className="d-block">
              {attendee.amount}{' '}
              {pluralize(attendee.label, parseInt(attendee.amount, 10))}
            </small>
          );
        })}
      </div>
      {/* TODO refactor this - only minor changes occur to the code */}
      {/* eslint-disable-next-line no-nested-ternary */}
      {isClassFull() ? (
        <>
          <Link
            to="/"
            role="button"
            aria-disabled="true"
            className="btn btn-outline-secondary disabled col-2"
            title="class is full!"
          >
            <XCircleFill />
          </Link>
          <Tooltip>
            The class is full! Please wait for space to become available.
          </Tooltip>
        </>
      ) : isRoleFull() ? (
        <>
          <Link
            to="/"
            role="button"
            aria-disabled="true"
            className="btn btn-outline-secondary disabled col-2"
            title="class is full!"
          >
            <XCircleFill />
          </Link>
          <Tooltip>
            There is already one {role} in the class, please wait for space to
            become available.
          </Tooltip>
        </>
      ) : (
        <Link
          to={`/room/${(theRoom || room).id}/${role}`}
          role="button"
          className="btn btn-outline-secondary col-2"
          title="Go to class!"
        >
          <ChevronBarRight />
        </Link>
      )}
    </div>
  );
}

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

function Lobby(props) {
  // Store the state of changes
  const [isValid, setIsValid] = useState(false);
  const [room, setRoom] = useState(null);
  const [role, setRole] = useState(null);
  const changed = useRef({});

  useEffect(() => {
    return function cleanup() {
      // cleanup changes after navigating away
      changed.current = {};
    };
  }, []);

  async function formValidator(e) {
    const targetEl = e.target;
    const parentEl = targetEl.parentElement;
    const roleSelectEl = document.getElementById('role-select');
    // Default value is invalid
    if ([ROLE_STUDENT, ROLE_INSTRUCTOR].indexOf(roleSelectEl.value) < 0) {
      roleSelectEl.setCustomValidity('You must select a role');
    } else {
      roleSelectEl.setCustomValidity('');
      // set role state
      setRole(roleSelectEl.value);
    }
    if (
      !(targetEl.id in changed.current) &&
      parentEl.classList.contains('form-group')
    ) {
      // Add validation UI state after initial change only
      parentEl.classList.add('was-validated');
      changed.current[targetEl.id] = true;
    }
    if (targetEl.id === 'room-id') {
      // Always unset the room to ensure valid state of form
      setRoom(null);
    }
    // Specifically check if the roomId is a potentially valid roomId
    if (targetEl.id === 'room-id' && !targetEl.validity.patternMismatch) {
      const maybeRoomId = targetEl.value;
      const response = await fetch(`/api/rooms/${maybeRoomId}`);
      const data = await response.json();
      if ('id' in data) {
        // the room exists
        setRoom(data);
        // remove validation message if it existed
        targetEl.setCustomValidity('');
        document.getElementById('not-real-room-id').classList.add('d-none');
      } else {
        // add validation message when room is not valid
        targetEl.setCustomValidity('This room has not been created yet.');
        document.getElementById('not-real-room-id').classList.remove('d-none');
      }
    }
    // Remove "not real room ID" tooltip even if the validation fails
    if (targetEl.id === 'room-id' && targetEl.validity.patternMismatch) {
      targetEl.setCustomValidity('');
      document.getElementById('not-real-room-id').classList.add('d-none');
    }
    // Connect state validity to the form's validity
    setIsValid(targetEl.form.checkValidity());
  }

  return (
    <div className="lobby">
      <Helmet>
        <title>Lobby | Amplify</title>
        <link rel="canonical" href="https://amplifyourskill.com/" />
      </Helmet>
      <p className="pt-3 pl-3">
        Welcome to Amplify, were we endeavor to amplify your skill!
      </p>
      <p className="pl-3">
        Below please select your role and enter the room identifier provided to
        you.
      </p>
      <form
        className="col-4"
        onChange={formValidator}
        onSubmit={e => e.preventDefault()}
      >
        <div className="form-group">
          <select
            className="form-control"
            id="role-select"
            defaultValue="Select a role..."
            required
          >
            <option disabled>Select a role...</option>
            <option value={ROLE_STUDENT}>Student</option>
            <option value={ROLE_INSTRUCTOR}>Instructor</option>
          </select>
        </div>
        <div className="form-group position-relative">
          <input
            type="text"
            className="form-control"
            id="room-id"
            placeholder="Enter Room ID: e.g. AB12CD34"
            pattern="^[0-9a-zA-Z]{8}$"
            maxLength="8"
            required
          />
          <div id="not-real-room-id" className="invalid-tooltip d-none">
            This room has not been created yet
          </div>
          <div className="valid-tooltip">Correct!</div>
          <div className="conditional-feedback">
            <ExclamationCircle /> Must be 8 characters in length
          </div>
          <div className="conditional-feedback">
            <ExclamationCircle /> May only contain alphanumeric characters
          </div>
        </div>
        <RoomCard
          isValid={isValid}
          room={room}
          role={role}
          ws={props.ws}
          key={props.ws}
        />
      </form>
    </div>
  );
}

export default Lobby;
