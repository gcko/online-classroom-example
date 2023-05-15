import { Link, Route, Routes } from 'react-router-dom';
import { ChevronBarRight, XCircleFill } from 'react-bootstrap-icons';
import React from 'react';
import { ROLE_INSTRUCTOR, ROLE_STUDENT } from '../common/constants';
import ValidRoom from '../classroom/ValidClassroom';
import Tooltip from '../common/Tooltip';

function WaitingArea({ room, role, ws }) {
  function isRoleFull(rm, attendee) {
    return (
      rm.attendance.filter(
        (element) => element.name === attendee && element.amount > 0
      ) > 0
    );
  }

  function isClassFull(rm) {
    return isRoleFull(rm, ROLE_STUDENT) && isRoleFull(rm, ROLE_INSTRUCTOR);
  }

  if (isClassFull(room)) {
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
  if (isRoleFull(room, role)) {
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
        to={`/room/${room.id}/${role}`}
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

export default WaitingArea;
