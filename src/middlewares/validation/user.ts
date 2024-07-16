import * as userService from '../../services/user.js';
import { ApplicationError } from '../../utils/error.js';
import type { Request, Response, NextFunction } from 'express';
import type { NormalizedResponse } from '../../utils/types/express.js';
import type { InferRequest, InferResponse } from '../../utils/types/express.js';
import type { isValidEmailPayload } from './common.js';
import type { isValidOtpPayload } from './otp.js';
import type { parseImage } from '../upload.js';
import type { User } from '@prisma/client';

export async function isUnverifiedUserExistsPayload(
  req:
    | InferRequest<typeof isValidEmailPayload>
    | InferRequest<typeof isValidOtpPayload>,
  res: InferResponse<typeof isValidEmailPayload, { user: User }>,
  next: NextFunction
): Promise<void> {
  const { email } = req.body;

  try {
    const user = await userService.getUnverifiedUserByEmail(email);
    res.locals.user = user;
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  next();
}

export type ValidRegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export function isValidRegisterUserPayload(
  req: Request<unknown, unknown, ValidRegisterUserPayload>,
  res: Response<NormalizedResponse>,
  next: NextFunction
): void {
  const { name, email, password, phoneNumber } = req.body;

  if (!name || !email || !password || !phoneNumber) {
    res.status(400).json({
      message: 'Name, email, password, and phone number are required'
    });
    return;
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof phoneNumber !== 'string'
  ) {
    res.status(400).json({
      message: 'Name, email, password, and phone number must be string'
    });
    return;
  }

  next();
}

export type ValidUpdateUserPayload = {
  name: string;
  email: string;
  phoneNumber: string;
};

export function isValidUpdateUserPayload(
  req: InferRequest<typeof parseImage, ValidUpdateUserPayload>,
  res: InferResponse<typeof parseImage>,
  next: NextFunction
): void {
  const { name, email, phoneNumber } = req.body;

  if (!name || !email || !phoneNumber) {
    res
      .status(400)
      .json({ message: 'Name, email, and phone number are required' });
    return;
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof phoneNumber !== 'string'
  ) {
    res
      .status(400)
      .json({ message: 'Name, email, and phone number must be string' });
    return;
  }

  next();
}
