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

function EnabledCardContents({ room, role }) {
  function getRoomAttendance() {
    // TODO get this from the server
    return [
      {
        name: 'instructor',
        label: 'Instructor',
        amount: 0,
      },
      {
        name: 'student',
        label: 'Student',
        amount: 1,
      },
    ];
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
    return isRoleFull('student') && isRoleFull('instructor');
  }

  return (
    <div className="card-body row align-items-center">
      <div className="card-text col-10 mb-0">
        <p>{room.name}</p>
        {getRoomAttendance().map(attendee => {
          return (
            <small key={attendee.name} className="d-block">
              {attendee.amount} {pluralize(attendee.label, attendee.amount)}
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
          to={`/room/${room.roomId}/${role}`}
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

function RoomCard({ isValid, room, role }) {
  return (
    <div className="card mt-3">
      {isValid ? (
        <EnabledCardContents room={room} role={role} />
      ) : (
        <DisabledCardContents />
      )}
    </div>
  );
}

function Lobby() {
  const [isValid, setIsValid] = useState(false);
  const [room, setRoom] = useState(null);
  const [role, setRole] = useState(null);
  // Store the state of changes
  const changed = useRef({});
  useEffect(() => {
    return function cleanup() {
      // cleanup changes after navigating away
      changed.current = {};
    };
  }, []);

  function formValidator(e) {
    const parentEl = e.target.parentElement;
    const roleSelectEl = document.getElementById('role-select');
    // Default value is invalid
    if (['student', 'instructor'].indexOf(roleSelectEl.value) < 0) {
      roleSelectEl.setCustomValidity('You must select a role');
    } else {
      roleSelectEl.setCustomValidity('');
      // set role state
      setRole(roleSelectEl.value);
    }
    if (
      !(e.target.id in changed.current) &&
      parentEl.classList.contains('form-group')
    ) {
      // Add validation UI state after initial change only
      parentEl.classList.add('was-validated');
      changed.current[e.target.id] = true;
    }
    // TODO move to server
    const validRooms = [
      {
        roomId: '11111111',
        name: 'Javascript 101',
      },
      {
        roomId: 'ABCDEFGH',
        name: 'Javascript 201',
      },
    ];
    if (e.target.id === 'room-id') {
      // Always unset the room to ensure valid state of form
      setRoom(null);
    }
    // Specifically check if the roomId is a valid roomId
    if (e.target.id === 'room-id' && !e.target.validity.patternMismatch) {
      const maybeRoomId = e.target.value;
      let validRoomFound = false;
      // TODO send the entered potentially valid room ID to the server
      //  and get null or a room Object in response
      for (let i = 0; i < validRooms.length; i += 1) {
        if (maybeRoomId === validRooms[i].roomId) {
          validRoomFound = true;
          setRoom(validRooms[i]);
          // remove validation message if it existed
          e.target.setCustomValidity('');
          document.getElementById('not-real-room-id').classList.add('d-none');
        }
      }
      if (!validRoomFound) {
        // add validation message when room is not valid
        e.target.setCustomValidity('This room has not been created yet.');
        document.getElementById('not-real-room-id').classList.remove('d-none');
      }
    }
    // Remove "not real room ID" tooltip even if the validation fails
    if (e.target.id === 'room-id' && e.target.validity.patternMismatch) {
      e.target.setCustomValidity('');
      document.getElementById('not-real-room-id').classList.add('d-none');
    }
    // Connect state validity to the form's validity
    setIsValid(e.target.form.checkValidity());
  }

  return (
    <div className="lobby">
      <Helmet>
        <title>Lobby | Amplify</title>
        <link rel="canonical" href="https://amplifyourskill.com/" />
      </Helmet>
      <p className="pt-3">
        Welcome to Amplify, were we endeavor to amplify your skill!
      </p>
      <p>
        Below please select your role and enter the room identifier provided to
        you.
      </p>
      <form className="col-4" onChange={formValidator}>
        <div className="form-group">
          <select
            className="form-control"
            id="role-select"
            defaultValue="Select a role..."
            required
          >
            <option disabled>Select a role...</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        {/* TODO: customize validation feedback to fit */}
        <div className="form-group position-relative">
          <input
            type="text"
            className="form-control"
            id="room-id"
            placeholder="Enter Room ID: e.g. AB12CD34"
            pattern="[0-9a-zA-Z]{8}"
            maxLength="8"
            required
          />
          <div id="not-real-room-id" className="invalid-tooltip d-none">
            This room ID has not been created yet
          </div>
          <div className="valid-tooltip">Correct!</div>
          <div className="conditional-feedback">
            <ExclamationCircle /> Must be 8 characters in length
          </div>
          <div className="conditional-feedback">
            <ExclamationCircle /> May only contain alphanumeric characters
          </div>
        </div>
        <RoomCard isValid={isValid} room={room} role={role} />
      </form>
    </div>
  );
}

export default Lobby;
