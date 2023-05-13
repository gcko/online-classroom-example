import { Link, Route, Routes } from 'react-router-dom';
import { ChevronBarRight, XCircleFill } from 'react-bootstrap-icons';
import React from 'react';
import { ROLE_INSTRUCTOR, ROLE_STUDENT } from '../common/constants';
import ValidRoom from '../classroom/ValidClassroom';
import Tooltip from '../common/Tooltip';

function WaitingArea({ theRoom, room, role, ws }) {
  function isRoleFull(rm, attendee) {
    // eslint-disable-next-line no-restricted-syntax
    for (const element of rm.attendance) {
      if (element.name === attendee) {
        return element.amount > 0;
      }
    }
    // the role wasn't found!
    return -1;
  }

  function isClassFull(rm) {
    return isRoleFull(rm, ROLE_STUDENT) && isRoleFull(rm, ROLE_INSTRUCTOR);
  }

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

export default WaitingArea;
