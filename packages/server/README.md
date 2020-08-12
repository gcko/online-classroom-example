## Overview

Please see the main [Readme](../../README.md) for the full overview of the application.

In addition to the main overview, the server makes use of a few 3rd party libraries.

## 3rd Party Libraries

For the back-end, the libraries in use are as follows:

* [ws](https://github.com/websockets/ws) - "a Node.js WebSocket library". Simple and fast
 WebSocket client and server implementation. 
* [nodemon](https://github.com/remy/nodemon) - Nodemon will monitor any changes in 
 the source directories and automatically restart the node app. `nodemon` replaced `node`
 to run the [start script](package.json). 

## Tests

In the project directory, you can run:

### `jest`

To see a brief list of tests, please check [app.test.js](src/app.test.js).

Also check out the integration tests surrounding the API endpoints, [here](src/test%20api%20endpoints.sh).
