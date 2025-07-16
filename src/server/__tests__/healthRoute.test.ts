import request from 'supertest';
const app = require('../../../server/index.js');

describe('Health API', () => {
  it('responds with status 200 and status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });
}); 