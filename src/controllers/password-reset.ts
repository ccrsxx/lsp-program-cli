import * as userService from '../services/user.js';
import * as authService from '../services/auth.js';
import * as passwordResetService from '../services/password-reset.js';
import { ApplicationError } from '../utils/error.js';
import type { Request, Response } from 'express';
import type { isValidCredentialPayload } from '../middlewares/validation/auth.js';
import type {
  isValidPasswordResetPayload,
  isValidResetPasswordProfilePayload
} from '../middlewares/validation/password-reset.js';
import type {
  InferRequest,
  InferResponse,
  NormalizedResponse
} from '../utils/types/express.js';

export async function checkLinkToResetPassword(
  req: Request<{ token: string }>,
  res: Response<NormalizedResponse>
): Promise<void> {
  const token = req.params.token;

  try {
    await passwordResetService.checkLinkToResetPassword(token);

    res.status(200).json({ message: 'Verification is valid' });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function sendVerifyToResetPassword(
  req: InferRequest<typeof isValidCredentialPayload>,
  res: InferResponse<typeof isValidCredentialPayload>
): Promise<void> {
  const { email } = req.body;

  try {
    await passwordResetService.sendVerifyToResetPassword(email);

    res.status(201).json({
      message: 'Account verification sent successfully'
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function changePassword(
  req: InferRequest<typeof isValidPasswordResetPayload>,
  res: InferResponse<typeof isValidPasswordResetPayload>
): Promise<void> {
  try {
    const payload = req.body;

    await passwordResetService.changePassword(payload);

    res.status(200).json({ message: 'Password successfully updated' });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function resetPasswordProfile(
  req: InferRequest<typeof isValidResetPasswordProfilePayload>,
  res: InferResponse<typeof isValidResetPasswordProfilePayload>
): Promise<void> {
  const { id, email } = res.locals.user;

  const { oldPassword, newPassword } = req.body;

  try {
    const user = await userService.getUserByEmail(email);

    if (!user.password) {
      res
        .status(404)
        .json({ message: 'Cant get user password, user password is empty' });
      return;
    }

    const isOldPasswordMatch = await authService.isPasswordMatch(
      oldPassword,
      user.password
    );

    if (!isOldPasswordMatch) {
      res.status(401).json({ message: 'Old password is not match' });
      return;
    }

    const encryptedNewPassword = await authService.hashPassword(newPassword);

    const resetPassword = await passwordResetService.resetPasswordProfile(
      id,
      encryptedNewPassword
    );

    res.status(200).json({
      message: 'Password successfully updated',
      data: resetPassword
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
