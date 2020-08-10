const models = require('../models');

const { rooms, submissions } = models;

function submissionService() {
  function getLargestSubmissionId() {
    const keys = Object.keys(submissions);
    let maxKey = -1;
    for (let i = 0; i < keys.length; i += 1) {
      maxKey = maxKey < keys[i] ? keys[i] : maxKey;
    }
    return maxKey;
  }

  function getSubmissions() {
    return submissions;
  }

  function getSubmission(submissionId) {
    return submissions[submissionId];
  }

  function createOrUpdateSubmission(roomId, submission) {
    // this is a service call
    const room = rooms[roomId];
    // Submissions MUST exist tied to a room
    if (room) {
      let submissionId;
      if ('submissionId' in room) {
        // This is actually a PUT (update), not a create
        submissionId = room.submissionId;
      } else {
        submissionId = getLargestSubmissionId() + 1;
      }
      // Submissions need to be attached to an existing room
      submissions[submissionId] = {
        submissionId,
        roomId,
        text: submission,
      };
      // create or update the room's submissionId
      room['submissionId'] = submissionId;
      return submissionId;
    }
    return false;
  }

  submissionService.getSubmissions = getSubmissions;
  submissionService.getSubmission = getSubmission;
  submissionService.createOrUpdateSubmission = createOrUpdateSubmission;
}

function roomService() {
  submissionService();
  function getRooms() {
    return rooms;
  }
  function getRoom(roomId) {
    return rooms[roomId];
  }
  function getRoomSubmission(roomId) {
    const room = getRoom(roomId);

    if (room && 'submissionId' in room) {
      return submissionService.getSubmission(room.submissionId);
    }
  }

  function updateRoom(roomId, body) {
    const room = getRoom(roomId);
    if (room) {
      if ('name' in body) {
        // update name
        room.name = body.name;
      }
      if ('submission' in body) {
        // you can "update" a room creating a new submission
        room.submissionId = submissionService.createOrUpdateSubmission(
          roomId,
          body.submission
        );
      }
      return true;
    }
    // room didn't exist
    return false;
  }

  roomService.getRooms = getRooms;
  roomService.getRoom = getRoom;
  roomService.getRoomSubmission = getRoomSubmission;
  roomService.updateRoom = updateRoom;
}

module.exports = {
  submissionService,
  roomService,
};
