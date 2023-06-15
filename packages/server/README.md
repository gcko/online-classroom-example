## Overview

Please see the main [Readme](../../README.md) for the full overview of the application.

In addition to the main overview, the server makes use of a few 3rd party libraries.

## 3rd Party Libraries

For the back-end, the libraries in use are as follows:

* [Ts.ED](https://tsed.io/) - Ts.ED is a Node.js Framework on top of Express/Koa.js. Written in Typescript,
  it helps you build your server-side application easily and quickly.
* [socket.io](https://socket.io/) - Bidirectional and low-latency communication for every platform.
  WebSocket implementation.

## Tests

In the project directory, you can run:

### `jest`

To see a brief list of tests, please check the spec.ts files. Example: [RoomController.spec.ts](src/controllers/api/RoomController.spec.ts).

Also check out the integration tests, [here](src/Server.integration.spec.ts).

## Docker

```
# build docker image
docker compose build

# start docker image
docker compose up
```

## Barrelsby

This project uses [barrelsby](https://www.npmjs.com/package/barrelsby) to generate index files to import the controllers.

Edit [.barreslby.json](.barrelsby.json) to customize it.
