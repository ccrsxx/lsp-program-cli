import * as userNotificationService from '../services/user-notification.js';
import { ApplicationError } from '../utils/error.js';
import type { isUserNotificationExistsPayload } from '../middlewares/validation/user-notification.js';
import type { InferRequest, InferResponse } from '../utils/types/express.js';
import type { isAuthorized } from '../middlewares/auth.js';

export async function getUserNotification(
  _req: InferRequest<typeof isAuthorized>,
  res: InferResponse<typeof isAuthorized>
): Promise<void> {
  try {
    const { id } = res.locals.user;

    const notification = await userNotificationService.getUserNotification(id);

    res.status(200).json({ data: notification });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function readAllNotification(
  _req: InferRequest<typeof isAuthorized>,
  res: InferResponse<typeof isAuthorized>
): Promise<void> {
  try {
    const { id } = res.locals.user;

    await userNotificationService.readAllNotification(id);

    res.status(200).json({
      message: 'All notifications have been read'
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateUserNotification(
  req: InferRequest<typeof isUserNotificationExistsPayload>,
  res: InferResponse<typeof isUserNotificationExistsPayload>
): Promise<void> {
  const { id } = req.params;

  try {
    const notification =
      await userNotificationService.updateUserNotification(id);

    res.status(200).json({
      message: 'User notification updated successfully',
      data: notification
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function destroyUserNotification(
  req: InferRequest<typeof isUserNotificationExistsPayload>,
  res: InferResponse<typeof isUserNotificationExistsPayload>
): Promise<void> {
  const { id } = req.params;

  try {
    await userNotificationService.destroyUserNotification(id);

    res.status(200).json({ message: 'User notification deleted successfully' });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
