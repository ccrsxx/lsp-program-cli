import type { Request, Response, NextFunction } from 'express';
import type { NormalizedResponse } from '../../utils/types/express.js';

export type ValidOtpPayload = {
  otp: string;
  email: string;
};

export function isValidOtpPayload(
  req: Request<unknown, unknown, ValidOtpPayload>,
  res: Response<NormalizedResponse>,
  next: NextFunction
): void {
  const { otp, email } = req.body;

  if (!otp || !email) {
    res.status(400).json({ message: 'OTP and email are required' });
    return;
  }

  if (typeof otp !== 'string' || typeof email !== 'string') {
    res.status(400).json({ message: 'OTP and email must be string' });
    return;
  }

  next();
}
