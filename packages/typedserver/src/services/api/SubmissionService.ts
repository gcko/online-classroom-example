import { Inject, InjectorService, OnInit, Service } from '@tsed/di';
import submissions from 'src/fixtures/submissions';
import { Submission, Submissions, Room } from 'src/types';
import { Hooks } from '@tsed/core';
import { MySocketService } from 'src/services/MySocketService';

export interface SubmissionEvent {
  $submissionChange(submissionId: string): Promise<void>;
}

@Service()
export class SubmissionService extends Hooks implements OnInit {
  @Inject()
  protected injector: InjectorService;

  private submissionsObject: Submissions;
  constructor(private mySocketService: MySocketService) {
    super();
    this.submissionsObject = submissions;
  }
  $onInit(): Promise<never> | void {
    return undefined;
  }

  get submissions(): Promise<Submissions> {
    return Promise.resolve(this.submissionsObject);
  }

  async getSubmission(submissionId: string): Promise<Submission> {
    return Promise.resolve(this.submissionsObject[submissionId]);
  }

  async createOrUpdateSubmission(room: Room, submission: string): Promise<string> {
    let subId: string;
    if ('submissionId' in room && room.submissionId) {
      // this is a PUT, not CREATE
      subId = room.submissionId;
    } else {
      subId = String(this.getLargestSubmissionId() + 1);
    }
    // Submissions need to be attached to an existing room
    this.submissionsObject[subId] = {
      id: subId,
      roomId: room.id,
      text: submission
    };
    // create or update the room's submissionId
    room.submissionId = subId;
    // fire event only if there is some submission
    if (submission != null && submission.length > 0) {
      this.mySocketService.changeSubmissionEvent(this.submissionsObject[subId]);
    }
    return subId;
  }

  private getLargestSubmissionId(): number {
    const keys = Object.keys(this.submissionsObject).map((id) => parseInt(id, 10));
    let maxKey = -1;
    keys.forEach((key) => {
      maxKey = maxKey < key ? key : maxKey;
    });
    return maxKey;
  }
}
