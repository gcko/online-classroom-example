import React, { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  ChevronBarRight,
  ExclamationCircle,
  XCircleFill,
} from 'react-bootstrap-icons';
import pluralize from 'pluralize';
import './Lobby.scss';
import { ROLE_INSTRUCTOR, ROLE_STUDENT } from '../common/constants';
import Layout from '../Layout';
import ValidRoom from '../classroom/ValidClassroom';

function getRoomAttendance(r) {
  return r.attendance;
}
function isRoleFull(room, attendee) {
  const attendance = getRoomAttendance(room);
  // eslint-disable-next-line no-restricted-syntax
  for (const element of attendance) {
    if (element.name === attendee) {
      return element.amount > 0;
    }
  }
  // the role wasn't found!
  return -1;
}

function isClassFull(room) {
  return isRoleFull(room, ROLE_STUDENT) && isRoleFull(room, ROLE_INSTRUCTOR);
}

function Tooltip(props) {
  return (
    <div className="tooltip fade bs-tooltip-right show" role="tooltip">
      <div className="arrow" />
      <div className="tooltip-inner">{props.children}</div>
    </div>
  );
}

function WaitingArea({ theRoom, room, role, ws }) {
  if (isClassFull(theRoom || room)) {
    return (
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
    );
  }
  if (isRoleFull(theRoom || room, role)) {
    return (
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
    );
  }
  return (
    <>
      <Link
        to={`/room/${(theRoom || room).id}/${role}`}
        role="button"
        className="btn btn-primary col-2"
        title="Go to class!"
      >
        <ChevronBarRight />
      </Link>
      <Routes>
        <Route
          path="/room/:roomId/:role"
          element={<ValidRoom room={room} role={role} ws={ws} key={ws} />}
        />
      </Routes>
    </>
  );
}

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
        {getRoomAttendance(theRoom || room).map((attendee) => (
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

  useEffect(
    () =>
      function cleanup() {
        // cleanup changes after navigating away
        changed.current = {};
      },
    []
  );

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
    <Layout>
      <div className="lobby col-4 mx-auto">
        <Helmet>
          <title>Lobby | Amplify</title>
          <link rel="canonical" href="https://amplifyourskill.com/" />
        </Helmet>
        <p className="pt-3 pl-3">
          Welcome to Amplify, were we endeavor to amplify your skill!
        </p>
        <p className="pl-3">
          Below please select your role and enter the room identifier provided
          to you.
        </p>
        <form onChange={formValidator} onSubmit={(e) => e.preventDefault()}>
          <div className="form-group mb-3">
            <select
              className="form-select"
              id="role-select"
              defaultValue="Select a role..."
              required
            >
              <option disabled>Select a role...</option>
              <option value={ROLE_STUDENT}>Student</option>
              <option value={ROLE_INSTRUCTOR}>Instructor</option>
            </select>
          </div>
          <div className="form-group position-relative mb-3">
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
    </Layout>
  );
}

export default Lobby;
