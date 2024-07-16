import { prisma } from '../utils/db.js';
import type { PrismaTransaction } from '../utils/types/prisma.js';
import type { User } from '@prisma/client';
import type { ValidRegisterUserPayload } from '../middlewares/validation/user.js';
import type { PayloadCreateUserWithoutOtp } from '../services/oauth.js';

export function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id }
  });
}

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email, verified: true }
  });
}

export function getUserByPhoneNumber(phoneNumber: string) {
  return prisma.user.findUnique({
    where: { phoneNumber, verified: true }
  });
}

export function getUserByEmailOrPhoneNumber(
  email: string,
  phoneNumber: string
) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
      verified: true
    }
  });
}

export function getUnverifiedUser(email: string) {
  return prisma.user.findUnique({
    where: { email, verified: false }
  });
}

export function getVerifiedUserWithEmailAndPhoneNumber(
  email: string,
  phoneNumber: string
) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
      verified: true
    }
  });
}

export function getUnverifiedUserByEmailAndPhoneNumber(
  email: string,
  phoneNumber: string
) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
      verified: false
    }
  });
}

export function getAdminUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
      role: {
        name: 'ADMIN'
      }
    }
  });
}

export function getAdminUserByPhoneNumber(phoneNumber: string) {
  return prisma.user.findUnique({
    where: {
      phoneNumber,
      role: {
        name: 'ADMIN'
      }
    }
  });
}

export function createUser(payload: ValidRegisterUserPayload) {
  return prisma.user.create({
    data: {
      ...payload,
      role: {
        connect: {
          name: 'USER'
        }
      }
    }
  });
}

export function createVerifiedUser(payload: PayloadCreateUserWithoutOtp) {
  return prisma.user.create({
    data: {
      ...payload,
      verified: true,
      role: {
        connect: {
          name: 'USER'
        }
      }
    }
  });
}

export function updateUser(
  id: string,
  payload: Partial<User>,
  tx?: PrismaTransaction
): Promise<User> {
  const db = tx ?? prisma;
  return db.user.update({
    where: { id },
    data: payload
  });
}

export function destroyUser(id: string) {
  return prisma.user.delete({
    where: { id }
  });
}

export function resetPasswordProfile(id: string, newPassword: string) {
  return prisma.user.update({
    where: { id },
    data: { password: newPassword }
  });
}
