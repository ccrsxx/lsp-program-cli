import * as otpService from '../services/otp.js';
import { ApplicationError } from '../utils/error.js';
import type { ValidOtpPayload } from '../middlewares/validation/otp.js';
import type { isUnverifiedUserExistsPayload } from '../middlewares/validation/user.js';
import type { InferRequest, InferResponse } from '../utils/types/express.js';

export async function sendOtpRequest(
  req: InferRequest<typeof isUnverifiedUserExistsPayload>,
  res: InferResponse<typeof isUnverifiedUserExistsPayload>
): Promise<void> {
  const { email } = req.body;
  const { id: userId } = res.locals.user;

  try {
    await otpService.sendOtpRequest(email, userId);

    res.status(201).json({ message: 'OTP sent successfully' });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function verifyOtp(
  req: InferRequest<typeof isUnverifiedUserExistsPayload, ValidOtpPayload>,
  res: InferResponse<typeof isUnverifiedUserExistsPayload>
): Promise<void> {
  try {
    const payload = req.body;

    await otpService.verifyOtp(payload);

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
