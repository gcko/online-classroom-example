const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { version } = require('../../package.json');

const router = Router();

// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Amplify API documentation',
      version,
      description: 'Documentation for the Amplify API',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'Swagger',
        url: 'https://swagger.io',
        email: 'Info@SmartBear.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3333/api',
      },
    ],
  },
  apis: ['./src/models/*.js', './src/routes/*.js'],
};
const specs = swaggerJsdoc(options);
router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

module.exports.doc = router;
module.exports.swaggerOptions = options.swaggerDefinition;
