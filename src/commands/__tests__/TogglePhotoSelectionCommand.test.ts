import fs from 'fs';
import path from 'path';
import { PhotoMetadataRepository } from '../../repositories/PhotoMetadataRepository';
import { TogglePhotoSelectionCommand } from '../TogglePhotoSelectionCommand';

const testMetadataPath = path.join(__dirname, '../../../test-fixtures/test-metadata.json');
const testImageDir = path.join(__dirname, '../../../test-fixtures/images');

describe('TogglePhotoSelectionCommand', () => {
  let repository: PhotoMetadataRepository;

  beforeEach(() => {
    if (fs.existsSync(testMetadataPath)) {
      fs.unlinkSync(testMetadataPath);
    }
    repository = new PhotoMetadataRepository(testMetadataPath);
  });

  afterEach(() => {
    if (fs.existsSync(testMetadataPath)) {
      fs.unlinkSync(testMetadataPath);
    }
  });

  describe('execute', () => {
    it('should update selection state to true', () => {
      const command = new TogglePhotoSelectionCommand(repository, testImageDir);

      command.execute('test1.jpg', true);

      expect(repository.getSelection('test1.jpg')).toBe(true);
    });

    it('should update selection state to false', () => {
      const command = new TogglePhotoSelectionCommand(repository, testImageDir);
      repository.setSelection('test1.jpg', true);

      command.execute('test1.jpg', false);

      expect(repository.getSelection('test1.jpg')).toBe(false);
    });

    it('should throw error when photo does not exist', () => {
      const command = new TogglePhotoSelectionCommand(repository, testImageDir);

      expect(() => {
        command.execute('nonexistent.jpg', true);
      }).toThrow('Photo not found');
    });
  });
});
