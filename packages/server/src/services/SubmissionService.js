const eventMixin = require('../eventMixin');

class SubmissionService {
  constructor(submissions, rooms) {
    this.submissions = submissions;
    this.rooms = rooms;
  }

  getLargestSubmissionId() {
    const keys = Object.keys(this.submissions);
    let maxKey = -1;
    for (let i = 0; i < keys.length; i += 1) {
      maxKey = maxKey < keys[i] ? keys[i] : maxKey;
    }
    return maxKey;
  }

  getSubmissions() {
    return this.submissions;
  }

  getSubmission(submissionId) {
    return this.submissions[submissionId];
  }

  createOrUpdateSubmission(roomId, submission, roomService) {
    const room = roomService.getRoom(roomId);
    // Submissions MUST exist tied to a room
    if (room) {
      let submissionId;
      if ('submissionId' in room) {
        // This is actually a PUT (update), not a create
        submissionId = room.submissionId;
      } else {
        submissionId = this.getLargestSubmissionId() + 1;
      }
      // Submissions need to be attached to an existing room
      this.submissions[submissionId] = {
        submissionId,
        roomId,
        text: submission,
      };
      // create or update the room's submissionId
      room.submissionId = submissionId;
      // fire event
      this.trigger('change:submission', this.submissions[submissionId]);
      return submissionId;
    }
    return false;
  }
}
// Add the event handler
Object.assign(SubmissionService.prototype, eventMixin);

module.exports = SubmissionService;
