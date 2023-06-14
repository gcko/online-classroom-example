/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room access
 */

import { Controller } from '@tsed/di';
import { Get, Post, Put } from '@tsed/schema';
import { RoomService } from 'src/services/api/RoomService';
import { Room, Submission } from 'src/types';
import { BodyParams, PathParams } from '@tsed/platform-params';
import { NotFound } from '@tsed/exceptions';

@Controller('/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  /**
   * @swagger
   * path:
   *  /rooms/:
   *    get:
   *      summary: Get a list of rooms
   *      tags: [Rooms]
   *      responses:
   *        "200":
   *          description: A list of Room schemas
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Room'
   *              examples:
   *                Example with rooms:
   *                  value:
   *                    [
   *                      {
   *                        "id": "11111111",
   *                        "name": "Javascript 101",
   *                        "submissionId": "1",
   *                        "attendance": [
   *                          {
   *                            "name": "student",
   *                            "label": "Student",
   *                            "amount": 0,
   *                          },
   *                          {
   *                            "name": "instructor",
   *                            "label": "Instructor",
   *                            "amount": 0,
   *                          }
   *                        ]
   *                      },
   *                      {
   *                        "id": "2222AAAA",
   *                        "name": "Javascript 102",
   *                        "submissionId": "1",
   *                        "attendance": [
   *                          {
   *                            "name": "student",
   *                            "label": "Student",
   *                            "amount": 1,
   *                          },
   *                          {
   *                            "name": "instructor",
   *                            "label": "Instructor",
   *                            "amount": 1,
   *                          }
   *                        ]
   *                      },
   *                    ]
   *                Example with no rooms:
   *                  value:
   *                    [
   *                      {
   *                      }
   *                    ]
   */
  @Get('/')
  async findAll(): Promise<Room[]> {
    return this.roomService.rooms;
  }

  /**
   * @swagger
   * path:
   *  /rooms/{id}:
   *    get:
   *      summary: Get a room by id
   *      tags: [Rooms]
   *      parameters:
   *        - name: id
   *          in: path
   *          description: ID of room to fetch
   *          required: true
   *          schema:
   *            type: string
   *            pattern: ^[0-9a-zA-Z]{8}$
   *      responses:
   *        "200":
   *          description: A Room schema
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/Room'
   *       "404":
   *         description: Room not Found
   */
  @Get('/:roomId')
  async findOne(@PathParams('roomId') roomId: string): Promise<Room> {
    const room = await this.roomService.getRoom(roomId);
    if (room) {
      return room;
    }
    throw new NotFound('Room Not Found');
  }

  /**
   * @swagger
   * path:
   *  /rooms/{id}/submission:
   *    get:
   *      summary: Get a specific room's submission
   *      tags: [Rooms]
   *      parameters:
   *        - name: id
   *          in: path
   *          description: ID of room to fetch
   *          required: true
   *          schema:
   *            type: string
   *            pattern: ^[0-9a-zA-Z]{8}$
   *      responses:
   *        "200":
   *          description: A Submission schema
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/Submission'
   *        "404":
   *          description: Submission not Found
   */
  @Get('/:roomId/submission')
  async findOneSubmission(@PathParams('roomId') roomId: string): Promise<Submission> {
    const submission = await this.roomService.getRoomSubmission(roomId);
    if (submission) {
      return submission;
    }
    throw new NotFound('No Submission Found');
  }

  /**
   * @swagger
   * path:
   *  /rooms/{id}:
   *    put:
   *      summary: Put an update to a room by id
   *      tags: [Rooms]
   *      parameters:
   *        - name: id
   *          in: path
   *          description: ID of room to fetch
   *          required: true
   *          schema:
   *            type: string
   *            pattern: ^[0-9a-zA-Z]{8}$
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              required:
   *                - name
   *                - attendance
   *              properties:
   *                name:
   *                  type: string
   *                  description: Name of the room.
   *                submissionId:
   *                  type: string
   *                  pattern: ^\d.*$
   *                  description: unique ID for a submission.
   *                attendance:
   *                  type: array
   *                  items:
   *                    type: object
   *                    required:
   *                      - name
   *                      - label
   *                      - amount
   *                    minItems: 2
   *                    maxItems: 2
   *                    uniqueItems: true
   *                    properties:
   *                      name:
   *                        type: string
   *                        enum:
   *                          - student
   *                          - instructor
   *                        description: Machine-readable name of the attendee. All lowercase.
   *                      label:
   *                        type: string
   *                        enum:
   *                          - Student
   *                          - Instructor
   *                        description: Human-readable name of the attendee. Sentence case.
   *                      amount:
   *                        type: integer
   *                        maximum: 1
   *                        minimum: 0
   *                        description: The amount of attendees of this certain type currently in the room. 0 or 1.
   *                  description: a list of objects containing the amount of each type of user in the room. Required.
   *      responses:
   *        "200":
   *          description: A Room schema
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/Room'
   *        "404":
   *          description: The supplied room ID does not exist
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  error:
   *                    type: string
   *                    description: The error message supplied from the server.
   */
  @Put('/:roomId')
  async updateRoom(@PathParams('roomId') roomId: string, @BodyParams('body') room: Room): Promise<Room> {
    const status = await this.roomService.updateRoom(roomId, room);
    if (!status) {
      throw new NotFound(`Room ${roomId} does not exist`);
    }
    return status as Room;
  }

  @Post('/:roomId/:role/decrement')
  async decrementRole(@PathParams('roomId') roomId: string, @PathParams('role') role: 'instructor' | 'student'): Promise<void> {
    // this is for navigator.sendBeacon;
    // the browser does not listen for a result, do not send a result
    return await this.roomService.decrementRoleAmount(roomId, role);
  }
}
