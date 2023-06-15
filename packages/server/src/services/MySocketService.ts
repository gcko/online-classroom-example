import * as SocketIO from 'socket.io';
import { Nsp, Socket, SocketService, SocketSession } from '@tsed/socketio';
import { Room, Submission } from 'src/types';

@SocketService('/socket')
export class MySocketService {
  @Nsp nsp: SocketIO.Namespace;

  /**
   * Triggered when a new client connects to the Namespace.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
    console.log(` ==== SOCKET ID ${socket.id} CONNECTED ==== `);
  }

  /**
   * Triggered when a client disconnects from the Namespace.
   */
  $onDisconnect(@Socket socket: SocketIO.Socket) {
    console.log(` ==== SOCKET ID ${socket.id} DISCONNECTED ==== `);
  }

  changeSubmissionEvent(submission: Submission) {
    this.nsp.emit('change:submission', submission);
  }

  changeAttendanceEvent(room: Room) {
    this.nsp.emit('change:attendance', room);
  }
}
