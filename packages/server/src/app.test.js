const request = require('supertest');
const app = require('./app');

describe('app', () => {
  it('should respond with 301 on GET', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(301);
  });

  describe('api', () => {
    it('should respond with 200 on GET', async () => {
      const response = await request(app).get('/api');
      expect(response.statusCode).toBe(200);
    });
  });
});
