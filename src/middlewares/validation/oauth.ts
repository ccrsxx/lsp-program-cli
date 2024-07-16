import type { Request, Response, NextFunction } from 'express';
import type { NormalizedResponse } from '../../utils/types/express.js';

export type ValidGoogleOauthCode = {
  code: string;
};

export function isValidGoogleOauthCode(
  req: Request<unknown, unknown, unknown, ValidGoogleOauthCode>,
  res: Response<NormalizedResponse>,
  next: NextFunction
): void {
  const { code } = req.query;

  if (!code) {
    res.status(400).json({
      message: 'Code is required'
    });
    return;
  }

  if (typeof code !== 'string') {
    res.status(400).json({
      message: 'Code must be string'
    });
    return;
  }

  next();
}
