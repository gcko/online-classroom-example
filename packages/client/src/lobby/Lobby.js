import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ExclamationCircle } from 'react-bootstrap-icons';
import './Lobby.scss';
import { ROLE_INSTRUCTOR, ROLE_STUDENT } from '../common/constants';
import Layout from '../Layout';
import RoomCard from './room-card/RoomCard';

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
