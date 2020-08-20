/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room access
 */

const { Router } = require('express');

const router = Router();

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

router.get('/', (req, res) => {
  return res.send(req.services.room.getRooms());
});

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
 */
router.get('/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = req.services.room.getRoom(roomId);

  if (room) {
    res.send(room);
  } else {
    // Room didn't exist
    res.send({});
  }
});

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
 */
router.get('/:roomId/submission', (req, res) => {
  const { roomId } = req.params;
  const submission = req.services.room.getRoomSubmission(
    roomId,
    req.services.submission
  );

  if (submission) {
    res.send(submission);
  } else {
    // submission or room doesn't exist
    res.send({});
  }
});

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
router.put('/:roomId', (req, res) => {
  const { roomId } = req.params;
  const status = req.services.room.updateRoom(
    roomId,
    req.body,
    req.services.submission
  );

  if (!status) {
    // Room did not exist
    res.status(404);
    // return res.send({ error: new Error(`The room ${roomId} does not exist`) });
    return res.send({ error: `Room ${roomId} does not exist` });
  }
  res.send(status);
});

router.post('/:roomId/:role/decrement', req => {
  const { roomId, role } = req.params;
  req.services.room.decrementRoleAmount(roomId, role);
  // this is for navigator.sendBeacon;
  // the browser does not listen for a result, do not send a result
});

module.exports = router;
