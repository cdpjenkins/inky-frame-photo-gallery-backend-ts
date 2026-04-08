import request from 'supertest';
import app from '../../app';

describe('GET /', () => {
  it('should render the index page with title Express', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Express');
    expect(response.text).toContain('Welcome to Express');
  });
});

describe('GET /list', () => {
  it('should return a plaintext list of image filenames', async () => {
    const response = await request(app).get('/list');

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe(
`file1.jpg
file2.jpg
file3.jpg`);
  });
});