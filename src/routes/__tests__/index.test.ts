import request from 'supertest';
import dedent from 'dedent';
import path from 'path';
import app from '../../app';
import { createApp } from '../../app';

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
    expect(response.text).toBe(dedent`
      file1.jpg
      file2.jpg
      file3.jpg
    `);
  });

  it('should return jpg files from the configured image directory', async () => {
    const testImageDir = path.join(__dirname, '../../../test-fixtures/images');
    const testApp = createApp({ imageDir: testImageDir });

    const response = await request(testApp).get('/list');

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe(dedent`
      test1.jpg
      test2.jpg
    `);
  });
});