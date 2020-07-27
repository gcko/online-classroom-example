# Xccelerate Engineering Offsite

## Getting Started

- `yarn`
- `yarn start:<PACKAGE_NAME>` OR `yarn start` should you wish to serve both the frontend and backend in parallel

## Instructions

1. Fork this repository into your github account.
1. You may use any JS library or technologies to your liking
1. When you are done with the challenge, please push to your forked repository and send an email to sean.n@xccelerate.co.

### Frontend

You'll find a React App in `packages/client`. Please build on it to contain a Lobby and a Classroom:

1. Lobby
2. Classroom

No pages are required to be mobile-responsive.

#### Lobby

This will be the first page the user sees. It should contain the following:

- Select dropdown for user to select "student" or "instructor" role
- Input text field for user to enter a room id.
- Button that takes the user to the Classroom as a Student or Instructor depending on the role selected.
- Each classroom should only host a maximum of one student and one instructor at a time.
- Display error message if:
  - The room id + role is already in use.
  - The room is full.

#### Classroom

STUDENT VIEW:

The Classroom should contain a Code Editor. You may use any third party library for this Code Editor. The specs are as follows:

- The left panel is for code input
- The right panel is for code output (see repl.it as an example)
- The Code Editor only needs to handle Javascript input.
- Above the Code Editor there should be two buttons:
  - The first button runs the input code and outputs its results onto the right panel.
  - The second button submits the input code to the instructor.

INSTRUCTOR VIEW:

- The Classroom only displays the student's submitted code.
- Submitted code should update in real time.

### Backend

You'll find an Express app in `packages/server`. Please build it to handle:

- Rooms (can be stored in memory for simplicity sake)
- Code submissions

## What we're looking for:

- Clean code (follow SOLID principles)
- Follow best practices of React and Express
