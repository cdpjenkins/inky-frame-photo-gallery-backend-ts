import express from 'express';
import fs from 'fs/promises';
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', async function(req, res, next) {
  try {
    const imageDir = req.app.get('imageDir');

    const files = await fs.readdir(imageDir);
    const jpgFiles = files.filter(file => file.endsWith('.jpg'));

    res.type('text/plain');
    res.send(jpgFiles.join('\n'));
  } catch (error) {
    next(error);
  }
});

export default router;