import * as process from 'process';
// eslint-disable-next-line import/no-extraneous-dependencies
import { io } from 'socket.io-client';

const URL =
  process.env.NODE_ENV === 'production'
    ? window.location
    : 'ws://localhost:3334/socket';

export default io(URL);
