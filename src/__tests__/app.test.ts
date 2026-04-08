import request from 'supertest';
import app from '../app';

describe('404 error handling', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');

    expect(response.status).toBe(404);
  });
});