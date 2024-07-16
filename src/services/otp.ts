import * as userNotificationService from './user-notification.js';
import * as userRepository from '../repositories/user.js';
import * as otpRepository from '../repositories/otp.js';
import { ApplicationError, generateApplicationError } from '../utils/error.js';
import { sendOtpEmail } from '../utils/mail.js';
import { generateRandomOTP } from '../utils/utils.js';
import { prisma } from '../utils/db.js';
import type { ValidOtpPayload } from '../middlewares/validation/otp.js';

export async function sendOtpRequest(email: string, userId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      await otpRepository.setUsedTrueByUserId(userId, tx);

      const nextFiveMinutesDate = new Date();

      nextFiveMinutesDate.setMinutes(nextFiveMinutesDate.getMinutes() + 5);

      const payload = {
        otp: generateRandomOTP(),
        used: false,
        userId: userId,
        expiredAt: nextFiveMinutesDate
      };

      const otpData = await otpRepository.createOtpVerification(payload, tx);

      await sendOtpEmail(email, otpData.otp);
    });
  } catch (err) {
    throw generateApplicationError(err, 'Error while generating OTP', 500);
  }
}

export async function verifyOtp(payload: ValidOtpPayload) {
  const { otp, email } = payload;

  try {
    const verifyOtpData = await otpRepository.getDataOtpVerificationByOtp(
      otp,
      email
    );

    if (!verifyOtpData) {
      throw new ApplicationError('Verification invalid', 401);
    }

    const userId = verifyOtpData.userId;

    await prisma.$transaction(async (tx) => {
      await otpRepository.updateUsedOtpVerification(otp, userId, tx);
      await userRepository.updateUser(userId, { verified: true }, tx);
      await userNotificationService.createUserNotification(
        userId,
        { name: 'Notifikasi', description: 'Selamat datang di SoraPOS!' },
        tx
      );
    });
  } catch (err) {
    throw generateApplicationError(err, 'Error while verifying OTP', 500);
  }
}
