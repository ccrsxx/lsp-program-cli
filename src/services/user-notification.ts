import * as userNotificationRepository from '../repositories/user-notification.js';
import { ApplicationError, generateApplicationError } from '../utils/error.js';
import type { UserNotification } from '@prisma/client';
import type { PrismaTransaction } from '../utils/types/prisma.js';

export async function getUserNotification(
  id: string
): Promise<UserNotification[]> {
  try {
    const notification =
      await userNotificationRepository.getUserNotification(id);
    return notification;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting user notification',
      500
    );
  }
}

export async function getUserNotificationById(
  id: string
): Promise<UserNotification> {
  try {
    const notification =
      await userNotificationRepository.getUserNotificationById(id);

    if (!notification) {
      throw new ApplicationError('User notification not found', 404);
    }

    return notification;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting user notification details',
      500
    );
  }
}

export async function createUserNotification(
  userId: string,
  payload: Pick<UserNotification, 'name' | 'description'>,
  tx: PrismaTransaction
): Promise<UserNotification> {
  try {
    const notification =
      await userNotificationRepository.createUserNotification(
        userId,
        payload,
        tx
      );

    return notification;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while creating user notification',
      500
    );
  }
}

export async function readAllNotification(id: string): Promise<void> {
  try {
    await userNotificationRepository.readAllNotification(id);
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while getting user notifications',
      500
    );
  }
}

export async function updateUserNotification(
  id: string
): Promise<UserNotification> {
  try {
    const notification: UserNotification =
      await userNotificationRepository.updateUserNotification(id);

    return notification;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while updating user notifications',
      500
    );
  }
}

export async function destroyUserNotification(id: string): Promise<void> {
  try {
    await userNotificationRepository.destroyUserNotification(id);
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while deleting user notifications',
      500
    );
  }
}
