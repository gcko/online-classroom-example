import { join } from 'path';
import { Inject } from '@tsed/di';
import { Configuration, PlatformApplication } from '@tsed/common';
import '@tsed/platform-express'; // /!\ keep this import
import '@tsed/ajv';
import '@tsed/swagger';
import { config } from 'src/config';
import '@tsed/socketio';
import * as api from './controllers/api/index';
import * as pages from './controllers/pages/index';

@Configuration({
  ...config,
  acceptMimes: ['application/json'],
  httpPort: process.env.PORT || 3333,
  httpsPort: false, // CHANGE
  disableComponentsScan: true,
  mount: {
    '/api': [...Object.values(api)],
    '/': [...Object.values(pages)]
  },
  componentsScan: ['./services/**/**.ts'],
  socketIO: {
    cors: {
      origin: 'http://localhost:3000'
    }
  },
  swagger: [
    {
      path: '/doc',
      specVersion: '3.0.1'
    }
  ],
  middlewares: [
    'cors',
    'cookie-parser',
    'compression',
    'method-override',
    'json-parser',
    { use: 'urlencoded-parser', options: { extended: true } }
  ],
  views: {
    root: join(process.cwd(), '../views'),
    extensions: {
      ejs: 'ejs'
    }
  },
  exclude: ['**/*.spec.ts']
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;
}
