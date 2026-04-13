import fs from 'fs';
import path from 'path';
import { PhotoMetadataRepository } from '../PhotoMetadataRepository';

const testMetadataPath = path.join(__dirname, '../../../test-fixtures/test-metadata.json');

describe('PhotoMetadataRepository', () => {
  beforeEach(() => {
    if (fs.existsSync(testMetadataPath)) {
      fs.unlinkSync(testMetadataPath);
    }
  });

  afterEach(() => {
    if (fs.existsSync(testMetadataPath)) {
      fs.unlinkSync(testMetadataPath);
    }
  });

  describe('getSelection', () => {
    it('should return false by default for a photo that has not been set', () => {
      const repository = new PhotoMetadataRepository(testMetadataPath);

      const isSelected = repository.getSelection('test1.jpg');

      expect(isSelected).toBe(false);
    });
  });

  describe('setSelection', () => {
    it('should set and retrieve selection state for a photo', () => {
      const repository = new PhotoMetadataRepository(testMetadataPath);

      repository.setSelection('test1.jpg', true);

      expect(repository.getSelection('test1.jpg')).toBe(true);
    });

    it('should persist selection state across repository instances', () => {
      const repository1 = new PhotoMetadataRepository(testMetadataPath);
      repository1.setSelection('test1.jpg', true);

      const repository2 = new PhotoMetadataRepository(testMetadataPath);

      expect(repository2.getSelection('test1.jpg')).toBe(true);
    });
  });

  describe('getAllSelections', () => {
    it('should return all selection states', () => {
      const repository = new PhotoMetadataRepository(testMetadataPath);
      repository.setSelection('test1.jpg', true);
      repository.setSelection('test2.jpg', false);
      repository.setSelection('test3.jpg', true);

      const allSelections = repository.getAllSelections();

      expect(allSelections).toEqual({
        'test1.jpg': { selected: true },
        'test2.jpg': { selected: false },
        'test3.jpg': { selected: true },
      });
    });
  });
});