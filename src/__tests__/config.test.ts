import { createApp } from '../app';
import path from 'path';

describe('Application Configuration', () => {
  it('should accept an imageDir configuration parameter', () => {
    const testImageDir = path.join(__dirname, '../../test-fixtures/images');

    const app = createApp({ imageDir: testImageDir });

    expect(app.get('imageDir')).toBe(testImageDir);
  });
});
