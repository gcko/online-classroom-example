import { Inject, InjectorService, OnInit, Service } from '@tsed/di';
import rooms from 'src/fixtures/rooms';
import { Rooms, Room, Submission, Attendance } from 'src/types';
import { SubmissionService } from 'src/services/api/SubmissionService';
import { MySocketService } from 'src/services/MySocketService';

export interface RoomEvent {
  $attendanceChange(room: Room): Promise<void>;
}

@Service()
export class RoomService implements OnInit {
  @Inject()
  protected injector: InjectorService;

  private roomsObject: Rooms;
  constructor(private submissionService: SubmissionService, private mySocketService: MySocketService) {
    this.roomsObject = rooms;
  }

  get rooms(): Promise<Room[]> {
    return Promise.resolve(Object.keys(this.roomsObject).map((id) => this.roomsObject[id]));
  }

  async getRoom(roomId: string): Promise<Room | undefined> {
    return Promise.resolve(this.roomsObject[roomId]);
  }

  async getRoomSubmission(roomId: string): Promise<Submission | undefined> {
    const room = await this.getRoom(roomId);

    if (room && 'submissionId' in room && room.submissionId) {
      return this.submissionService.getSubmission(room.submissionId);
    }
  }

  async updateAttendance(roomId: string, attendance: Attendance[]): Promise<Room | boolean> {
    const room = await this.getRoom(roomId);
    if (room && attendance != null) {
      room.attendance = attendance;
      // trigger attendance change
      await this.injector.emit('$attendanceChange', room);
      return Promise.resolve(room);
    }
    // room did not exist
    return Promise.resolve(false);
  }

  async decrementRoleAmount(roomId: string, role: 'student' | 'instructor'): Promise<void> {
    const room = await this.getRoom(roomId);
    if (room && 'attendance' in room) {
      room.attendance = room.attendance.map((item) => {
        item.amount = item.name === role ? 0 : item.amount;
        return item;
      });
      this.mySocketService.changeAttendanceEvent(room);
    }
  }

  $onInit(): Promise<never> | void {
    return undefined;
  }
}
