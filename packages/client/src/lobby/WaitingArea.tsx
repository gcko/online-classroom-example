import { Link, Route, Routes } from 'react-router-dom';
import { ChevronBarRight, XCircleFill } from 'react-bootstrap-icons';
import React from 'react';
import { Role, Room } from 'src/types.ts';
import { ROLE_INSTRUCTOR, ROLE_STUDENT } from 'src/common/constants.ts';
import ValidRoom from 'src/classroom/ValidClassroom.tsx';
import Tooltip from 'src/common/Tooltip.tsx';

type Props = {
  room: Room;
  role: Role;
};

function WaitingArea({ room, role }: Props) {
  function isRoleFull(rm: Room, attendee: Role) {
    return (
      rm.attendance.filter(
        (element) => element.name === attendee && element.amount > 0
      ).length > 0
    );
  }

  function isClassFull(rm: Room) {
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
          <span>
            The class is full! Please wait for space to become available.
          </span>
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
          <span>
            There is already one {role} in the class, please wait for space to
            become available.
          </span>
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
          element={<ValidRoom room={room} role={role} key={room.id} />}
        />
      </Routes>
    </>
  );
}

export default WaitingArea;
