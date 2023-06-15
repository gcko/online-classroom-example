import { Controller } from '@tsed/di';
import { Description, Get, Post, Put, Returns, Summary } from '@tsed/schema';
import { RoomService } from 'src/services/api/RoomService';
import { Room } from 'src/types';
import { BodyParams, PathParams } from '@tsed/platform-params';
import { NotFound } from '@tsed/exceptions';
import { RoomModel } from 'src/models/RoomModel';
import { SubmissionModel } from 'src/models/SubmissionModel';

@Controller('/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  @Get('/')
  @Summary('Get a list of rooms')
  @Description('Return a list of Rooms')
  @Returns(200, Array).Of(RoomModel).Description('Success')
  async findAll(): Promise<RoomModel[]> {
    return await Promise.resolve(this.roomService.rooms);
  }

  @Get('/:roomId')
  @Summary('Get a room by id')
  @Description('Return a Room by given Room id')
  @Returns(200, RoomModel)
  @Returns(404).Description('Not Found')
  async findOne(@PathParams('roomId') roomId: string): Promise<RoomModel> {
    const room = await this.roomService.getRoom(roomId);
    if (room) {
      return room;
    }
    throw new NotFound('Room Not Found');
  }

  @Get('/:roomId/submission')
  @Summary('Get a submission for a Room')
  @Description('Return a Submission for a Room by given Room id')
  @Returns(200, SubmissionModel)
  @Returns(404).Description('Not Found')
  async findOneSubmission(@PathParams('roomId') roomId: string): Promise<SubmissionModel> {
    const submission = await this.roomService.getRoomSubmission(roomId);
    if (submission) {
      return submission;
    }
    throw new NotFound('No Submission Found');
  }

  @Put('/:roomId')
  @Summary('Update a Room Object with the provided Room')
  @Description('Update a Room Object with the provided Room and roomId')
  @Returns(200, RoomModel)
  @Returns(404).Description('Not Found')
  async updateRoom(@PathParams('roomId') roomId: string, @BodyParams('body') room: RoomModel): Promise<RoomModel> {
    const status = await this.roomService.updateRoom(roomId, room);
    if (!status) {
      throw new NotFound(`Room ${roomId} does not exist`);
    }
    return status as Room;
  }

  @Post('/:roomId/:role/decrement')
  @Summary('Decrement the number of instructors or students for a particular Room')
  @Description('Decrement the number of instructors or students for a particular Room')
  @Returns(204)
  async decrementRole(@PathParams('roomId') roomId: string, @PathParams('role') role: 'instructor' | 'student'): Promise<void> {
    // this is for navigator.sendBeacon;
    // the browser does not listen for a result, do not send a result
    return await this.roomService.decrementRoleAmount(roomId, role);
  }
}
