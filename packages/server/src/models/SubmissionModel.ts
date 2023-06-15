import { Submission } from 'src/types';
import { Description, Example, Property, Title } from '@tsed/schema';

export class SubmissionModel implements Submission {
  @Title('id')
  @Description('unique identifier for a Submission.')
  @Example('1')
  @Property()
  id: string;

  @Title('text')
  @Description('text of a Submission.')
  @Example(`console.log('info')`)
  @Property()
  text: string;

  @Title('roomId')
  @Description('unique identifier for a Room. Must be an sequence of 8 alphanumeric characters')
  @Example('111111111')
  @Property()
  roomId: string;
}
