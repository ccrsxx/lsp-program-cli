import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import * as otpController from '../controllers/otp.js';
import * as oauthController from '../controllers/oauth.js';
import * as otpValidationMiddleware from '../middlewares/validation/otp.js';
import * as passwordResetController from '../controllers/password-reset.js';
import * as authValidationMiddleware from '../middlewares/validation/auth.js';
import * as userValidationMiddleware from '../middlewares/validation/user.js';
import * as oauthValidationMiddleware from '../middlewares/validation/oauth.js';
import * as commonValidationMiddleware from '../middlewares/validation/common.js';
import * as passwordResetValidationMiddleware from '../middlewares/validation/password-reset.js';
import type { Application } from 'express';

export default (app: Application): void => {
  const router = Router();

  app.use('/auth', router);

  router.post(
    '/login',
    authValidationMiddleware.isValidCredentialPayload,
    authController.login
  );

  router.post(
    '/login/admin',
    authValidationMiddleware.isValidCredentialPayload,
    authController.loginWithAdmin
  );

  router.post(
    '/register',
    userValidationMiddleware.isValidRegisterUserPayload,
    authController.register
  );

  router.post(
    '/password-reset',
    commonValidationMiddleware.isValidEmailPayload,
    passwordResetController.sendVerifyToResetPassword
  );

  router.put(
    '/password-reset',
    passwordResetValidationMiddleware.isValidPasswordResetPayload,
    passwordResetController.changePassword
  );

  router.get(
    '/password-reset/:token',
    passwordResetController.checkLinkToResetPassword
  );

  router.post(
    '/otp',
    commonValidationMiddleware.isValidEmailPayload,
    userValidationMiddleware.isUnverifiedUserExistsPayload,
    otpController.sendOtpRequest
  );

  router.post(
    '/otp/verify',
    otpValidationMiddleware.isValidOtpPayload,
    userValidationMiddleware.isUnverifiedUserExistsPayload,
    otpController.verifyOtp
  );

  router.get('/google', oauthController.getGoogleAuthorizationUrl);

  router.get(
    '/google/callback',
    oauthValidationMiddleware.isValidGoogleOauthCode,
    oauthController.authenticateWithGoogle
  );
};
