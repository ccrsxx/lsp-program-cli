import { prisma } from '../utils/db.js';
import type { UserNotification } from '@prisma/client';
import type { PrismaTransaction } from '../utils/types/prisma.js';

export function getUserNotification(userId: string) {
  return prisma.userNotification.findMany({
    where: { userId }
  });
}

export function getUserNotificationById(id: string) {
  return prisma.userNotification.findUnique({
    where: { id }
  });
}

export function readAllNotification(userId: string) {
  return prisma.userNotification.updateMany({
    where: { userId },
    data: { viewed: true }
  });
}

export function updateUserNotification(id: string) {
  return prisma.userNotification.update({
    where: { id },
    data: { viewed: true }
  });
}

export function createUserNotification(
  userId: string,
  payload: Pick<UserNotification, 'name' | 'description'>,
  tx: PrismaTransaction
) {
  return tx.userNotification.create({
    data: {
      ...payload,
      userId
    }
  });
}

export function destroyUserNotification(id: string) {
  return prisma.userNotification.delete({
    where: { id }
  });
}
