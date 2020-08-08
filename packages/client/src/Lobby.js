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
        to="/room"
        role="button"
        aria-disabled="true"
        className="btn btn-outline-secondary disabled col-2"
      >
        <XCircleFill />
      </Link>
    </div>
  );
}

function EnabledCardContents() {
  return (
    <div className="card-body row align-items-center">
      <p className="card-text col-10 mb-0">Javascript 101</p>
      <Link
        to="/room"
        role="button"
        className="btn btn-outline-secondary col-2"
      >
        <ChevronBarRight />
      </Link>
    </div>
  );
}

function RoomCard({ isValid }) {
  return (
    <div className="card mt-3">
      {isValid ? <EnabledCardContents /> : <DisabledCardContents />}
    </div>
  );
}

function Lobby() {
  const [isValid, setIsValid] = useState(false);
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
    if (e.target.id === 'role-select') {
      // validate that
    }
    if (
      !(e.target.id in changed.current) &&
      parentEl.classList.contains('form-group')
    ) {
      // Add validation UI state after initial change only
      parentEl.classList.add('was-validated');
      changed.current[e.target.id] = true;
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
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="room-id"
            placeholder="Enter Room ID: e.g. AB12CD34"
            pattern="[0-9a-zA-Z]{8}"
            maxLength="8"
            required
          />
          <div className="conditional-feedback">
            <ExclamationCircle /> Must be 8 characters in length
          </div>
          <div className="conditional-feedback">
            <ExclamationCircle /> May only contain alphanumeric characters
          </div>
        </div>
        <RoomCard isValid={isValid} />
      </form>
    </div>
  );
}

export default Lobby;
