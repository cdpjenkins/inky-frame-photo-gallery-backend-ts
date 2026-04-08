import request from 'supertest';
import app from '../../app';

describe('GET /users', () => {
  it('should respond with a resource message', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.text).toBe('respond with a resource');
  });
});