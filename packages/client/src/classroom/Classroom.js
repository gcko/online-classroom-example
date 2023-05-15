import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import './Classroom.scss';
import Modal from '../common/Modal';
import ValidRoom from './ValidClassroom';
import { updateAttendance } from './common';
import Layout from '../Layout';

async function getRoom(roomId) {
  const response = await fetch(`/api/rooms/${roomId}`);
  return response.json();
}

function isRoleFull(attendee, attendance) {
  return (
    attendance.filter(
      (element) => element.name === attendee && element.amount > 0
    ) > 0
  );
}

function resolveAfterNSeconds(num) {
  const seconds = num * 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, seconds);
  });
}

function Classroom({ ws }) {
  const { roomId, role } = useParams();
  const [room, setRoom] = useState(null);
  const [isValid, setIsValid] = useState('pending');

  useEffect(() => {
    async function fetchData() {
      const newRoom = await getRoom(roomId);
      // Check if the role is in use
      const isRoleFilled = isRoleFull(role, newRoom.attendance);
      if (!isRoleFilled) {
        // Update the room's attendance
        await updateAttendance(newRoom, role);
      }
      // adding some time to view the message as it shows for only a brief second without it.
      await resolveAfterNSeconds(3);
      setRoom(() => newRoom);
      setIsValid(() => !!newRoom && !!newRoom.id && !isRoleFilled);
    }
    fetchData();
  }, [roomId, role]);

  if (isValid === true) {
    return <ValidRoom room={room} role={role} key={ws} />;
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
      <Modal title="Wait for verification">
        <p>Verifying the room code and availability...</p>
        <p>
          Go back to the <Link to="/">Lobby</Link>.
        </p>
      </Modal>
      <Routes>
        <Route
          path=":roomId/:role/*"
          element={<ValidRoom room={room} role={role} key={ws} />}
        />
      </Routes>
    </Layout>
  );
}
export default Classroom;
