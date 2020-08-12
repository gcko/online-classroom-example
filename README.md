# Xccelerate Engineering Offsite

## Getting Started

- `yarn`
- `yarn start:<PACKAGE_NAME>` OR `yarn start` should you wish to serve both the frontend and backend in parallel

### Frontend

You'll find a React App in `packages/client`. You will find it to contain a Lobby and a Classroom:

1. Lobby
2. Classroom

note: this is not mobile responsive at the moment.

#### Lobby

This is the first page a user sees. It contains the following:

- [x] Select dropdown for user to select "student" or "instructor" role
- [x] Input text field for user to enter a room id.
- [x] Button that takes the user to the Classroom as a Student or Instructor depending on the role selected.
- [x] Each classroom hosts a maximum of one student and one instructor at a time.
- [x] Displays error message when:
  - [x] The room id + role is already in use.
  - [x] The room is full.

#### Classroom

STUDENT VIEW:

The Classroom contains a Code Editor. The Code Editor was built using the [Ace editor](https://ace.c9.io/#nav=about). The specs are as follows:

- [x] The left panel is for code input (built using the Ace editor)
- [x] The right panel is for code output (Using an overridden Console object) 
- [x] The Code Editor only needs to handle Javascript input.
- [x] Above the Code Editor are two buttons:
  - [x] The first button runs the input code and outputs its results onto the right panel.
  - [x] The second button submits the input code to the instructor.

INSTRUCTOR VIEW:

- [x] The Classroom displays the student's submitted code.
- [x] Submitted code updates in real time.

### Backend

You'll find an Express app in `packages/server`. It handles:

- [x] Rooms (stored in memory)
- [x] Code submissions
