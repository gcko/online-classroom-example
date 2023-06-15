import { Controller } from '@tsed/di';
import { SubmissionService } from 'src/services/api/SubmissionService';
import { Description, Get, Post, Returns, Summary } from '@tsed/schema';
import { SubmissionModel } from 'src/models/SubmissionModel';
import { Submissions } from 'src/types';
import { BodyParams } from '@tsed/platform-params';
import { RoomService } from 'src/services/api/RoomService';

type Created = { created: boolean };

@Controller('/submissions')
export class SubmissionController {
  constructor(private readonly roomService: RoomService, private readonly submissionService: SubmissionService) {}
  @Get('/')
  @Summary('Get a list of Submissions')
  @Description('Return a list of Submissions')
  @Returns(200, Object).Of(SubmissionModel).Description('Success')
  async findAll(): Promise<Submissions> {
    return await Promise.resolve(this.submissionService.submissions);
  }

  @Post('/')
  @Summary('Create or Update a Submission')
  @Description('Create or Update a Submission')
  @Returns(200)
  async createOrUpdate(@BodyParams('roomId') roomId: string, @BodyParams('submission') text: string): Promise<Created> {
    const room = await this.roomService.getRoom(roomId);
    if (room) {
      const subId = await this.submissionService.createOrUpdateSubmission(room, text);
      return { created: !!subId };
    }
    return { created: false };
  }
}
