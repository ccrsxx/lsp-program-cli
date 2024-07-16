import type { Request, Response, NextFunction } from 'express';
import type { NormalizedResponse } from '../../utils/types/express.js';

export type ValidCredentialPayload = {
  email: string;
  password: string;
  phoneNumber: string;
};

export function isValidCredentialPayload(
  req: Request<unknown, unknown, ValidCredentialPayload>,
  res: Response<NormalizedResponse>,
  next: NextFunction
): void {
  const { email, phoneNumber, password } = req.body;

  const emailOrPhoneNumber = email || phoneNumber;

  if (!emailOrPhoneNumber || !password) {
    res.status(400).json({
      message: 'Email or phone number and password are required'
    });
    return;
  }

  if (typeof emailOrPhoneNumber !== 'string' || typeof password !== 'string') {
    res.status(400).json({
      message: 'Email or phone number and password must be string'
    });
    return;
  }

  next();
}
