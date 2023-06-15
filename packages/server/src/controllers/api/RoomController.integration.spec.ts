import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { RoomController } from 'src/controllers/api/RoomController';
import { Server } from 'src/Server';

describe('RoomController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        '/': [RoomController]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it('should call GET /', async () => {
    const response = await request.get('/').expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });
});
