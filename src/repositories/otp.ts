import { prisma } from '../utils/db.js';
import type { Prisma, Otp } from '@prisma/client';
import type {
  OmitBaseRecord,
  PrismaTransaction
} from '../utils/types/prisma.js';

export async function createOtpVerification(
  payload: OmitBaseRecord<Otp>,
  tx: PrismaTransaction
) {
  const db = tx ?? prisma;
  return db.otp.create({
    data: payload
  });
}

export async function setUsedTrueByUserId(
  userId: string,
  tx: PrismaTransaction
) {
  const db = tx ?? prisma;
  return db.otp.updateMany({
    where: {
      userId,
      expiredAt: {
        gt: new Date()
      }
    },
    data: {
      used: true
    }
  });
}

export async function getDataOtpVerificationByOtp(otp: string, email: string) {
  return prisma.otp.findFirst({
    where: {
      otp,
      used: false,
      user: {
        email
      }
    }
  });
}

export async function updateUsedOtpVerification(
  otp: string,
  userId: string,
  tx: PrismaTransaction
): Promise<Prisma.BatchPayload> {
  return tx.otp.updateMany({
    where: {
      otp,
      userId,
      expiredAt: {
        gt: new Date()
      }
    },
    data: {
      used: true
    }
  });
}
