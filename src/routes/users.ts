import { Router } from 'express';
import * as userController from '../controllers/user.js';
import * as uploadMiddleware from '../middlewares/upload.js';
import * as authMiddleware from '../middlewares/auth.js';
import * as passwordResetController from '../controllers/password-reset.js';
import * as userValidationMiddleware from '../middlewares/validation/user.js';
import * as passwordResetValidationMiddleware from '../middlewares/validation/password-reset.js';
import type { Application } from 'express';

export default (app: Application): void => {
  const router = Router();

  app.use('/users', router);

  router.get('/me', authMiddleware.isAuthorized, userController.getCurrentUser);

  router.put(
    '/me',
    authMiddleware.isAuthorized,
    uploadMiddleware.parseImage,
    userValidationMiddleware.isValidUpdateUserPayload,
    uploadMiddleware.uploadCloudinary,
    userController.updateUser
  );

  router.put(
    '/me/password-reset',
    authMiddleware.isAuthorized,
    passwordResetValidationMiddleware.isValidResetPasswordProfilePayload,
    passwordResetController.resetPasswordProfile
  );
};
