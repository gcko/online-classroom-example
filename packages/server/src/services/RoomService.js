const eventMixin = require('../eventMixin');

class RoomService {
  constructor(rooms, submissions) {
    this.rooms = rooms;
    this.submissions = submissions;
  }

  getRooms() {
    // return rooms as a simple array of objects
    const rooms = [];
    for (let i = 0; i < Object.keys(this.rooms).length; i += 1) {
      // push the room at a specific key to the simple array
      rooms.push(this.rooms[Object.keys(this.rooms)[i]]);
    }
    return rooms;
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

  decrementRoleAmount(roomId, role) {
    const room = this.getRoom(roomId);
    if ('attendance' in room) {
      const att = room.attendance;
      // find the role, set the amount to 0
      for (let i = 0; i < att.length; i += 1) {
        if (att[i].name === role) {
          att[i].amount = 0;
        }
      }
      this.trigger('change:attendance', room);
    }
  }
}
// Add the event handler
Object.assign(RoomService.prototype, eventMixin);

module.exports = RoomService;
