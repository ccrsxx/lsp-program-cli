import * as authService from '../services/auth.js';
import { ApplicationError } from '../utils/error.js';
import type { Request, Response, NextFunction } from 'express';
import type { Role, User } from '@prisma/client';
import type { NormalizedResponse } from '../utils/types/express.js';

export async function isAuthorized(
  req: Request<unknown, unknown, Record<string, unknown>>,
  res: Response<NormalizedResponse, { user: User }>,
  next: NextFunction
) {
  const authorization = req.get('authorization');

  if (!authorization) {
    res.status(400).json({ message: 'Missing authorization header' });
    return;
  }

  const [type, token] = authorization.split(' ');

  if (type.toLocaleLowerCase() !== 'bearer') {
    res.status(401).json({ message: 'Invalid authorization token' });
    return;
  }

  try {
    const user = await authService.verifyToken(token);
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

export function isAdmin(
  _req: Request,
  res: Response<{ message: string }, { role: Role }>,
  next: NextFunction
): void {
  const role = res.locals.role;

  const isAdmin = role.name === 'ADMIN';

  if (!isAdmin) {
    res
      .status(403)
      .json({ message: 'Only admin is allowed for this endpoint' });
    return;
  }

  res.locals.role = role;

  next();
}

export async function isLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authorization = req.get('authorization');

  if (!authorization) {
    res.locals.user = null;
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLocaleLowerCase() !== 'bearer') {
    res.status(401).json({ message: 'Invalid authorization token' });
    return;
  }

  try {
    const user: User = await authService.verifyToken(token);
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
