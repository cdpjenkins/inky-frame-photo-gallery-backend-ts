import fs from 'fs';
import path from 'path';
import { PhotoMetadataRepository } from '../repositories/PhotoMetadataRepository';

export class TogglePhotoSelectionCommand {
  constructor(
    private readonly repository: PhotoMetadataRepository,
    private readonly imageDir: string
  ) {}

  execute(filename: string, selected: boolean): void {
    const filePath = path.join(this.imageDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error('Photo not found');
    }

    this.repository.setSelection(filename, selected);
  }
}
