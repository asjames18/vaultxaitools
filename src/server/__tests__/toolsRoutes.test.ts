/** @jest-environment node */
import request from 'supertest';
const app = require('../../../server/index.js');

describe('Tools API', () => {
  it('returns 200 for public tools endpoint', async () => {
    const res = await request(app).get('/api/tools');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('tools');
    expect(res.body).toHaveProperty('pagination');
  });
}); 