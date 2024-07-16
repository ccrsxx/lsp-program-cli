import * as resetPasswordRepository from '../repositories/password-reset.js';
import * as userRepository from '../repositories/user.js';
import * as userService from './user.js';
import { prisma } from '../utils/db.js';
import { hashPassword } from './auth.js';
import { generateRandomToken } from '../utils/utils.js';
import { sendResetPasswordEmail } from '../utils/mail.js';
import { ApplicationError, generateApplicationError } from '../utils/error.js';
import type { PasswordReset, User } from '@prisma/client';
import type { ValidPasswordResetPayload } from '../middlewares/validation/password-reset.js';

export async function checkLinkToResetPassword(
  token: string
): Promise<PasswordReset> {
  try {
    const resetPasswordData =
      await resetPasswordRepository.getDataPasswordResetByToken(token);

    if (!resetPasswordData) {
      throw new ApplicationError('Verification invalid', 404);
    }

    return resetPasswordData;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while checking reset password link',
      500
    );
  }
}

export async function changePassword(payload: ValidPasswordResetPayload) {
  const { token, password } = payload;

  try {
    const resetPasswordData = await checkLinkToResetPassword(token);

    const userId = resetPasswordData.userId;

    const encryptedPassword = await hashPassword(password);

    const updatePassword = {
      password: encryptedPassword
    };

    await prisma.$transaction(async (tx) => {
      await userRepository.updateUser(userId, updatePassword, tx);
      await resetPasswordRepository.updateUsedPasswordResetLink(token, tx);
    });
  } catch (err) {
    throw generateApplicationError(err, 'Error changing password', 500);
  }
}

export async function sendVerifyToResetPassword(email: string): Promise<void> {
  try {
    const user = await userService.getUserByEmail(email);

    await prisma.$transaction(async (tx) => {
      await resetPasswordRepository.setUsedTrueByUserId(user.id, tx);

      const nextHourDate = new Date();

      nextHourDate.setHours(nextHourDate.getHours() + 1);

      const payload = {
        used: false,
        token: generateRandomToken(),
        userId: user.id,
        expiredAt: nextHourDate
      };

      const verifyToReset = await resetPasswordRepository.createPasswordReset(
        payload,
        tx
      );

      await sendResetPasswordEmail(email, verifyToReset.token);
    });
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while creating reset password link',
      500
    );
  }
}

export async function resetPasswordProfile(
  id: string,
  newPassword: string
): Promise<User> {
  try {
    const resetPassword = await userRepository.resetPasswordProfile(
      id,
      newPassword
    );

    return resetPassword;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while resetting password profile',
      500
    );
  }
}
