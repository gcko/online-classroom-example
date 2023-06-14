import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import './Classroom.scss';
import { Attendance, Role, Room } from 'src/types.ts';
import Modal from '../common/Modal.tsx';
import ValidRoom from './ValidClassroom.tsx';
import updateAttendance from './common.ts';
import Layout from '../Layout.tsx';

async function getRoom(roomId: string) {
  const response = await fetch(`/api/rooms/${roomId}`);
  return response.json();
}

function isRoleFull(attendee: Role, attendance: Attendance[]) {
  return (
    attendance.filter(
      (element) => element.name === attendee && element.amount > 0
    ).length > 0
  );
}

function resolveAfterNSeconds(num: number) {
  const seconds = num * 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, seconds);
  });
}

function Classroom() {
  const { roomId, role } = useParams();
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [isValid, setIsValid] = useState<boolean | 'pending'>('pending');

  useEffect(() => {
    async function fetchData() {
      const newRoom = await getRoom(roomId as string);
      // Check if the role is in use
      const isRoleFilled = isRoleFull(role as Role, newRoom.attendance);
      if (!isRoleFilled) {
        // Update the room's attendance
        await updateAttendance(newRoom, role as Role);
      }
      // adding some time to view the message as it shows for only a brief second without it.
      await resolveAfterNSeconds(3);
      setRoom(() => newRoom);
      setIsValid(() => !!newRoom && !!newRoom.id && !isRoleFilled);
    }
    fetchData().catch((e) => console.error(e));
  }, [roomId, role]);

  if (isValid === true) {
    return (
      <ValidRoom
        room={room as Room}
        role={role as Role}
        key={(room as Room).id}
      />
    );
  }
  if (isValid === false) {
    return (
      <Navigate
        to={{
          pathname: '/',
        }}
      />
    );
  }
  // default to waiting for verification
  return (
    <Layout>
      <>
        <Modal title="Wait for verification">
          <>
            <p>Verifying the room code and availability...</p>
            <p>
              Go back to the <Link to="/">Lobby</Link>.
            </p>
          </>
        </Modal>
        <Routes>
          <Route
            path=":roomId/:role/*"
            element={<ValidRoom room={room as Room} role={role as Role} />}
          />
        </Routes>
      </>
    </Layout>
  );
}
export default Classroom;
