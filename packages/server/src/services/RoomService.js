const eventMixin = require('../eventMixin');

class RoomService {
  constructor(rooms, submissions) {
    this.rooms = rooms;
    this.submissions = submissions;
  }

  getRooms() {
    return this.rooms;
  }

  getRoom(roomId) {
    return this.rooms[roomId];
  }

  getRoomSubmission(roomId, submissionService) {
    const room = this.getRoom(roomId);

    if (room && 'submissionId' in room) {
      return submissionService.getSubmission(room.submissionId);
    }
  }

  updateRoom(roomId, body, submissionService) {
    const room = this.getRoom(roomId);
    if (room) {
      if ('name' in body) {
        // update name
        room.name = body.name;
      }
      if ('submission' in body) {
        // you can "update" a room creating a new submission
        room.submissionId = submissionService.createOrUpdateSubmission(
          roomId,
          body.submission,
          this
        );
      }
      if ('attendance' in body) {
        // you can update the attendance of a room
        room.attendance = body.attendance;
        this.trigger('change:attendance', room);
      }
      return room;
    }
    // room didn't exist
    return false;
  }
}
// Add the event handler
Object.assign(RoomService.prototype, eventMixin);

module.exports = RoomService;
