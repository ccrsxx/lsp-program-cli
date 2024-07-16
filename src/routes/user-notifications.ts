import { Router } from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as userNotificationController from '../controllers/user-notification.js';
import * as userNotificationValidationMiddleware from '../middlewares/validation/user-notification.js';
import type { Application } from 'express';

export default (app: Application): void => {
  const router = Router();

  app.use('/user-notifications', router);

  router.get(
    '/',
    authMiddleware.isAuthorized,
    userNotificationController.getUserNotification
  );

  router.post(
    '/read-all',
    authMiddleware.isAuthorized,
    userNotificationController.readAllNotification
  );

  router.put(
    '/:id',
    authMiddleware.isAuthorized,
    userNotificationValidationMiddleware.isUserNotificationExistsPayload,
    userNotificationController.updateUserNotification
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthorized,
    userNotificationValidationMiddleware.isUserNotificationExistsPayload,
    userNotificationController.destroyUserNotification
  );
};
