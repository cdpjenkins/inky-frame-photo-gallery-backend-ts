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
      /images/test1.jpg
      /images/test2.jpg
      /images/test3.jpg
    `);
  });

  it('should return 404 without leaking internal info when directory does not exist', async () => {
    const nonExistentDir = path.join(__dirname, '../../../non-existent-directory');
    const appWithBadDir = createApp({ imageDir: nonExistentDir });

    const response = await request(appWithBadDir).get('/list');

    expect(response.status).toBe(404);
    expect(response.type).toBe('application/json');
    expect(response.body).toEqual({ error: 'Not found' });
    expect(JSON.stringify(response.body)).not.toContain('ENOENT');
    expect(JSON.stringify(response.body)).not.toContain('scandir');
    expect(JSON.stringify(response.body)).not.toContain(nonExistentDir);
  });
});

describe('GET /admin', () => {
  it('should return 200 with HTML content', async () => {
    const response = await request(testApp).get('/admin');

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');
  });

  it('should render an img tag for each image in the directory', async () => {
    const response = await request(testApp).get('/admin');

    expect(response.text).toContain('<img src="/images/test1.jpg"');
    expect(response.text).toContain('<img src="/images/test2.jpg"');
    expect(response.text).toContain('<img src="/images/test3.jpg"');
  });

  it('should not render img tags for non-jpg files', async () => {
    const response = await request(testApp).get('/admin');

    expect(response.text).not.toContain('readme.txt');
  });

  it('should return 404 without leaking internal info when directory does not exist', async () => {
    const nonExistentDir = path.join(__dirname, '../../../non-existent-directory');
    const appWithBadDir = createApp({ imageDir: nonExistentDir });

    const response = await request(appWithBadDir).get('/admin');

    expect(response.status).toBe(404);
    expect(response.type).toBe('application/json');
    expect(response.body).toEqual({ error: 'Not found' });
    expect(JSON.stringify(response.body)).not.toContain('ENOENT');
    expect(JSON.stringify(response.body)).not.toContain('scandir');
    expect(JSON.stringify(response.body)).not.toContain(nonExistentDir);
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

  it('should return 404 without leaking internal info when directory does not exist', async () => {
    const nonExistentDir = path.join(__dirname, '../../../non-existent-directory');
    const appWithBadDir = createApp({ imageDir: nonExistentDir });

    const response = await request(appWithBadDir).get('/images/test1.jpg');

    expect(response.status).toBe(404);
    expect(response.type).toBe('application/json');
    expect(response.body).toEqual({ error: 'Not found' });
    expect(JSON.stringify(response.body)).not.toContain('ENOENT');
    expect(JSON.stringify(response.body)).not.toContain('sendFile');
    expect(JSON.stringify(response.body)).not.toContain(nonExistentDir);
  });
});