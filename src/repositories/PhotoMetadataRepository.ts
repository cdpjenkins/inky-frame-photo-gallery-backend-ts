import fs from 'fs';

type PhotoMetadata = {
  selected: boolean;
};

type MetadataStore = Record<string, PhotoMetadata>;

export class PhotoMetadataRepository {
  private store: MetadataStore = {};

  constructor(private readonly metadataPath: string) {
    this.load();
  }

  getSelection(filename: string): boolean {
    return this.store[filename]?.selected ?? false;
  }

  setSelection(filename: string, selected: boolean): void {
    this.store[filename] = { selected };
    this.save();
  }

  getAllSelections(): MetadataStore {
    return this.store;
  }

  private load(): void {
    if (fs.existsSync(this.metadataPath)) {
      const data = fs.readFileSync(this.metadataPath, 'utf-8');
      this.store = JSON.parse(data);
    }
  }

  private save(): void {
    fs.writeFileSync(this.metadataPath, JSON.stringify(this.store, null, 2));
  }
}