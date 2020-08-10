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
    this.setState({ room });
    this.setState({ isValid: !!room && !!room.id });
  }

  render() {
    return (
      // First check the roomId is valid
      <>
        {/* eslint-disable-next-line no-nested-ternary */}
        {this.state.isValid === 'pending' ? (
          <Modal title="Wait for verification">
            <p>Verifying the room code...</p>
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
