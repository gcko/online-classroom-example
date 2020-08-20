/**
 * @swagger
 *  components:
 *    schemas:
 *      Submission:
 *        type: object
 *        required:
 *          - id
 *          - text
 *          - roomId
 *        properties:
 *          id:
 *            type: string
 *            pattern: ^\d.*$
 *            description: unique ID for the room. Must be a string of digits only.
 *          text:
 *            type: string
 *            description: Name of the room.
 *          roomId:
 *            type: string
 *            pattern: ^[0-9a-zA-Z]{8}$
 *            description: Foreign key to an existing room.
 */
const submissions = {
  1: {
    id: '1',
    text: 'console.log("I am submitted code!")',
    roomId: '11111111',
  },
};

module.exports = submissions;
