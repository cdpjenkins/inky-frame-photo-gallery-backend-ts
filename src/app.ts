import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

interface AppConfig {
  imageDir: string;
}

export function createApp(config: AppConfig) {
  const app = express();

  app.set('imageDir', config.imageDir);

  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'pug');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));

  app.use('/', indexRouter);
  app.use('/users', usersRouter);

  app.use(function(req: Request, res: Response, next: NextFunction) {
    next(createError(404));
  });

  app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
  });

  return app;
}

const app = createApp({ imageDir: process.env.IMAGE_DIR || './images' });

export default app;