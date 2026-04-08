import request from 'supertest';
import dedent from 'dedent';
import path from 'path';
import app from '../../app';
import { createApp } from '../../app';

const testImageDir = path.join(__dirname, '../../../test-fixtures/images');
const testApp = createApp({ imageDir: testImageDir });

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
    const response = await request(testApp).get('/list');

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe(dedent`
      test1.jpg
      test2.jpg
      test3.jpg
    `);
  });

  it('should return jpg files from the configured image directory', async () => {
    const response = await request(testApp).get('/list');

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe(dedent`
      test1.jpg
      test2.jpg
      test3.jpg
    `);
  });
});

describe('GET /images/:filename', () => {
  it('should return the image file with correct content type', async () => {
    const response = await request(testApp).get('/images/test1.jpg');

    expect(response.status).toBe(200);
    expect(response.type).toBe('image/jpeg');
    expect(response.body).toBeInstanceOf(Buffer);
  });

  it('should return 404 for non-jpg files', async () => {
    const response = await request(testApp).get('/images/readme.txt');

    expect(response.status).toBe(404);
  });

  it('should return 404 for non-existent files', async () => {
    const response = await request(testApp).get('/images/nonexistent.jpg');

    expect(response.status).toBe(404);
  });

  it('should prevent directory traversal attacks', async () => {
    const response = await request(testApp).get('/images/../should-not-be-accessible.jpg');

    expect(response.status).toBe(404);
  });
});