import { PlatformTest } from '@tsed/common';
import { RoomController } from 'src/controllers/api/RoomController';

describe('RoomController', () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it('should do something', () => {
    const instance = PlatformTest.get<RoomController>(RoomController);
    // const instance = PlatformTest.invoke<RoomController>(RoomController); // get fresh instance

    expect(instance).toBeInstanceOf(RoomController);
  });
});
