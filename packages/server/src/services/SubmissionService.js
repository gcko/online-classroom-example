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
      let subId;
      if ('submissionId' in room) {
        // This is a PUT (update), not a create
        subId = room.submissionId;
      } else {
        subId = this.getLargestSubmissionId() + 1;
      }
      // Submissions need to be attached to an existing room
      this.submissions[subId] = {
        submissionId: subId,
        roomId,
        text: submission,
      };
      // create or update the room's submissionId
      room.submissionId = subId;
      // fire event only if there is some submission
      if (submission !== '' && submission != null) {
        this.trigger('change:submission', this.submissions[subId]);
      }
      return subId;
    }
    return false;
  }
}
// Add the event handler
Object.assign(SubmissionService.prototype, eventMixin);

module.exports = SubmissionService;
