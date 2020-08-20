/**
 * @swagger
 *  components:
 *    schemas:
 *      Room:
 *        type: object
 *        required:
 *          - id
 *          - name
 *          - attendance
 *        properties:
 *          id:
 *            type: string
 *            pattern: ^[0-9a-zA-Z]{8}$
 *            maxLength: 8
 *            minLength: 8
 *            description: unique ID for the room.
 *          name:
 *            type: string
 *            description: Name of the room.
 *          submissionId:
 *            type: string
 *            pattern: ^\d.*$
 *            description: unique ID for a submission.
 *          attendance:
 *            type: array
 *            items:
 *              type: object
 *              required:
 *                - name
 *                - label
 *                - amount
 *              minItems: 2
 *              maxItems: 2
 *              uniqueItems: true
 *              properties:
 *                name:
 *                  type: string
 *                  enum:
 *                    - student
 *                    - instructor
 *                  description: Machine-readable name of the attendee. All lowercase.
 *                label:
 *                  type: string
 *                  enum:
 *                    - Student
 *                    - Instructor
 *                  description: Human-readable name of the attendee. Sentence case.
 *                amount:
 *                  type: integer
 *                  maximum: 1
 *                  minimum: 0
 *                  description: The amount of attendees of this certain type currently in the room. 0 or 1.
 *            description: a list of objects containing the amount of each type of user in the room. Required.
 */
const rooms = {
  11111111: {
    id: '11111111',
    name: 'Javascript 101',
    submissionId: '1',
    attendance: [
      {
        name: 'instructor',
        label: 'Instructor',
        amount: 0,
      },
      {
        name: 'student',
        label: 'Student',
        amount: 0,
      },
    ],
  },
  11111112: {
    id: '11111112',
    name: 'Javascript 102',
    attendance: [
      {
        name: 'instructor',
        label: 'Instructor',
        amount: 0,
      },
      {
        name: 'student',
        label: 'Student',
        amount: 0,
      },
    ],
  },
  11111113: {
    id: '11111113',
    name: 'Javascript 201',
    attendance: [
      {
        name: 'instructor',
        label: 'Instructor',
        amount: 0,
      },
      {
        name: 'student',
        label: 'Student',
        amount: 0,
      },
    ],
  },
};

module.exports = rooms;
