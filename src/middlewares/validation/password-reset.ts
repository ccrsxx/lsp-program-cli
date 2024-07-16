import type { Request, Response, NextFunction } from 'express';
import type {
  InferRequest,
  InferResponse,
  NormalizedResponse
} from '../../utils/types/express.js';
import type { isAuthorized } from '../auth.js';

export type ValidPasswordResetPayload = {
  token: string;
  password: string;
};

export function isValidPasswordResetPayload(
  req: Request<unknown, unknown, ValidPasswordResetPayload>,
  res: Response<NormalizedResponse>,
  next: NextFunction
): void {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: 'Token and password are required' });
    return;
  }

  if (typeof token !== 'string' || typeof password !== 'string') {
    res.status(400).json({ message: 'Token and password must be string' });
    return;
  }

  next();
}

export type ValidResetProfileBodyPayload = {
  oldPassword: string;
  newPassword: string;
};

export function isValidResetPasswordProfilePayload(
  req: InferRequest<typeof isAuthorized, ValidResetProfileBodyPayload>,
  res: InferResponse<typeof isAuthorized>,
  next: NextFunction
): void {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res
      .status(400)
      .json({ message: 'Old password and new password are required' });
    return;
  }

  if (typeof oldPassword !== 'string' || typeof newPassword !== 'string') {
    res
      .status(400)
      .json({ message: 'Old password and new password must be string' });
    return;
  }

  if (newPassword === oldPassword) {
    res
      .status(409)
      .json({ message: 'New password cannot be the same as old password' });
    return;
  }

  next();
}
