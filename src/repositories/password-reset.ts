import { prisma } from '../utils/db.js';
import type { PasswordReset, Prisma } from '@prisma/client';
import type {
  OmitBaseRecord,
  PrismaTransaction
} from '../utils/types/prisma.js';

export function createPasswordReset(
  payload: OmitBaseRecord<PasswordReset>,
  transaction: PrismaTransaction
): Promise<PasswordReset> {
  return transaction.passwordReset.create({
    data: payload
  });
}

export function getDataPasswordResetByToken(
  token: string
): Promise<PasswordReset | null> {
  return prisma.passwordReset.findFirst({
    where: {
      token,
      used: false,
      expiredAt: {
        gt: new Date()
      }
    }
  });
}

export function updateUsedPasswordResetLink(
  token: string,
  transaction: PrismaTransaction
): Promise<Prisma.BatchPayload> {
  return transaction.passwordReset.updateMany({
    where: {
      token
    },
    data: {
      used: true
    }
  });
}

export function setUsedTrueByUserId(
  userId: string,
  transaction: PrismaTransaction
): Promise<Prisma.BatchPayload> {
  return transaction.passwordReset.updateMany({
    where: {
      userId,
      used: false,
      expiredAt: {
        gt: new Date()
      }
    },
    data: {
      used: true
    }
  });
}
