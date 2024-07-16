import * as userNotificationService from '../../services/user-notification.js';
import { ApplicationError } from '../../utils/error.js';
import type { NextFunction } from 'express';
import type { UserNotification } from '@prisma/client';
import type { InferRequest, InferResponse } from '../../utils/types/express.js';
import type { isAuthorized } from '../auth.js';

export async function isUserNotificationExistsPayload(
  req: InferRequest<typeof isAuthorized>,
  res: InferResponse<
    typeof isAuthorized,
    { userNotification: UserNotification }
  >,
  next: NextFunction
): Promise<void> {
  const { id } = req.params;

  try {
    const userNotification =
      await userNotificationService.getUserNotificationById(id);
    res.locals.userNotification = userNotification;
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
