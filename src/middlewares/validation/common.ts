import type { Request, Response, NextFunction } from 'express';
import type { NormalizedResponse } from '../../utils/types/express.js';

export type ValidEmailPayload = {
  email: string;
};

export function isValidEmailPayload(
  req: Request<unknown, unknown, ValidEmailPayload>,
  res: Response<NormalizedResponse>,
  next: NextFunction
): void {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  if (typeof email !== 'string') {
    res.status(400).json({ message: 'Email must be string' });
    return;
  }

  next();
}
