import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  XCircleFill,
  ExclamationCircle,
  ChevronBarRight,
} from 'react-bootstrap-icons';
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

function EnabledCardContents({ room }) {
  return (
    <div className="card-body row align-items-center">
      <p className="card-text col-10 mb-0">{room.name}</p>
      <Link
        to={`/room/${room.roomId}`}
        role="button"
        className="btn btn-outline-secondary col-2"
      >
        <ChevronBarRight />
      </Link>
    </div>
  );
}

function RoomCard({ isValid, room }) {
  return (
    <div className="card mt-3">
      {isValid ? <EnabledCardContents room={room} /> : <DisabledCardContents />}
    </div>
  );
}

function Lobby() {
  const [isValid, setIsValid] = useState(false);
  const [room, setRoom] = useState(null);
  // Store the state of changes
  const changed = useRef({});
  useEffect(() => {
    return function cleanup() {
      // cleanup changes after navigating away
      changed.current = {};
    };
  });

  function formValidator(e) {
    const parentEl = e.target.parentElement;
    const roleSelectEl = document.getElementById('role-select');
    // Default value is invalid
    if (['student', 'instructor'].indexOf(roleSelectEl.value) < 0) {
      roleSelectEl.setCustomValidity('You must select a role');
    } else {
      roleSelectEl.setCustomValidity('');
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
        <RoomCard isValid={isValid} room={room} />
      </form>
    </div>
  );
}

export default Lobby;
