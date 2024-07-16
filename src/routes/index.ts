import * as indexController from '../controllers/index.js';
import type { Application } from 'express';

export default (app: Application): void => {
  app.get('/', indexController.ping);
};
