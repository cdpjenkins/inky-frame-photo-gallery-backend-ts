import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { TogglePhotoSelectionCommand } from '../commands/TogglePhotoSelectionCommand';
import { PhotoMetadataRepository } from '../repositories/PhotoMetadataRepository';
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', async function(req, res, next) {
  try {
    const imageDir = req.app.get('imageDir');
    const photoMetadataRepository: PhotoMetadataRepository = req.app.get('photoMetadataRepository');

    const files = await fs.readdir(imageDir);
    const jpgFiles = files.filter(file => file.endsWith('.jpg'));
    const selectedFiles = jpgFiles.filter(file => photoMetadataRepository.getSelection(file));
    const selectedFilesWithPrefix = selectedFiles.map(file => `/images/${file}`);

    res.type('text/plain');
    res.send(selectedFilesWithPrefix.join('\n'));
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    next(error);
  }
});

router.get('/admin', async function(req, res, next) {
  try {
    const imageDir = req.app.get('imageDir');
    const photoMetadataRepository: PhotoMetadataRepository = req.app.get('photoMetadataRepository');
    const files = await fs.readdir(imageDir);
    const jpgFiles = files.filter(file => file.endsWith('.jpg'));
    const imagesWithSelection = jpgFiles.map(file => ({
      filename: file,
      selected: photoMetadataRepository.getSelection(file),
    }));
    res.render('admin', { title: 'Admin', images: imagesWithSelection });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    next(error);
  }
});

router.get('/images/:filename', function(req, res, next) {
  const imageDir = req.app.get('imageDir');
  const filename = path.basename(req.params.filename);

  if (!filename.endsWith('.jpg')) {
    res.status(404).send('Not found');
    return;
  }

  const filePath = path.resolve(imageDir, filename);
  res.sendFile(filePath, (error: any) => {
    if (error) {
      if (error.code === 'ENOENT' || error.status === 404) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      next(error);
    }
  });
});

router.patch('/api/photos/:filename', function(req, res, next) {
  try {
    const togglePhotoSelectionCommand: TogglePhotoSelectionCommand = req.app.get('togglePhotoSelectionCommand');
    const filename = path.basename(req.params.filename);
    const { selected } = req.body;

    togglePhotoSelectionCommand.execute(filename, selected);

    res.json({ selected });
  } catch (error: any) {
    if (error.message === 'Photo not found') {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    next(error);
  }
});

export default router;