const request = require('supertest');
const app = require('./app');

describe('app', () => {
  it('should respond with 301 on GET', (done) => {
    request(app)
      .get('/')
      .then((resp) => {
        expect(resp.statusCode).toBe(301);
        done();
      })
      .catch((err) => done(err));
  });

  describe('api', () => {
    it('should respond with 200 on GET', (done) => {
      request(app)
        .get('/api')
        .then((response) => {
          expect(response.statusCode).toBe(200);
          done();
        })
        .catch((err) => done(err));
    });
  });
});
