import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './Classroom.sass';
import Modal from '../common/Modal';
import ValidRoom from './ValidClassroom';
import { updateAttendance } from './common';

async function getRoom(roomId) {
  const response = await fetch(`/api/rooms/${roomId}`);
  const room = await response.json();
  return room;
}

function isRoleFull(attendee, attendance) {
  for (let i = 0; i < attendance.length; i += 1) {
    if (attendance[i].name === attendee) {
      return parseInt(attendance[i].amount, 10) > 0;
    }
  }
  // the role wasn't found!
  return -1;
}

function resolveAfterNSeconds(num) {
  const seconds = num * 1000;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, seconds);
  });
}

class Classroom extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.match.params;
    this.state = {
      room: null,
      isValid: 'pending',
    };
  }

  async componentDidMount() {
    const room = await getRoom(this.params.roomId);
    // Check if the role is in use
    const isRoleFilled = isRoleFull(this.params.role, room.attendance);
    if (!isRoleFilled) {
      // Update the room's attendance
      await updateAttendance(room, this.params.role);
    }
    // adding some time to view the message as it shows for only a brief second without it.
    await resolveAfterNSeconds(3);
    this.setState({ room });
    this.setState({ isValid: !!room && !!room.id && !isRoleFilled });
  }

  render() {
    return (
      // First check the roomId is valid
      <>
        {/* eslint-disable-next-line no-nested-ternary */}
        {this.state.isValid === 'pending' ? (
          <Modal title="Wait for verification">
            <p>Verifying the room code and availability...</p>
            <p>
              Go back to the <Link to="/">Lobby</Link>.
            </p>
          </Modal>
        ) : this.state.isValid ? (
          <ValidRoom
            {...this.props}
            room={this.state.room}
            params={this.params}
            key={this.props.ws}
          />
        ) : (
          <Redirect
            to={{
              pathname: '/',
            }}
          />
        )}
      </>
    );
  }
}

export default Classroom;
