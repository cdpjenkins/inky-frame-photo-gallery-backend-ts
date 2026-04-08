import express from 'express';
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', function(req, res, next) {
  res.type('text/plain');
  res.send(
`file1.jpg
file2.jpg
file3.jpg`);
});

export default router;