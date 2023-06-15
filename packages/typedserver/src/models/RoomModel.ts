import { Description, Example, Property, Title } from '@tsed/schema';
import { Attendance, Room } from 'src/types';

export class RoomModel implements Room {
  @Title('id')
  @Description('unique identifier for a Room. Must be an sequence of 8 alphanumeric characters')
  @Example('111111111')
  @Property()
  public id: string;

  @Property()
  public name: string;

  @Title('submissionId')
  @Description('An optional identifier for a submission associated with this Room')
  @Example('1')
  @Property()
  public submissionId?: string;

  @Property()
  public submission?: string;

  @Property()
  public attendance: Attendance[] = [];
}
