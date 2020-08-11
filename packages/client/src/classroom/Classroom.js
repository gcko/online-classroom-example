import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './Classroom.sass';
import Modal from '../common/Modal';
import ValidRoom from './ValidClassroom';

async function getRoom(roomId) {
  const response = await fetch(`/api/rooms/${roomId}`);
  const room = await response.json();
  return room;
}

function isRoleFull(attendee, attendance) {
  for (let i = 0; i < attendance.length; i += 1) {
    if (attendance[i].name === attendee) {
      return attendance[i].amount > 0;
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
    // adding some time to view the message as it shows for only a brief second without it.
    await resolveAfterNSeconds(3);
    // Check if the role is in use
    const isRoleFilled = isRoleFull(this.params.role, room.attendance);
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
          <ValidRoom room={this.state.room} params={this.params} />
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
