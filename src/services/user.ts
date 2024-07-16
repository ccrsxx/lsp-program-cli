import * as otpService from './otp.js';
import * as authService from './auth.js';
import * as userRepository from '../repositories/user.js';
import { ApplicationError, generateApplicationError } from '../utils/error.js';
import { omitPropertiesFromObject } from '../utils/utils.js';
import type { User } from '@prisma/client';
import type {
  ValidUpdateUserPayload,
  ValidRegisterUserPayload
} from '../middlewares/validation/user.js';

export async function getUser(id: string): Promise<User> {
  try {
    const user = await userRepository.getUser(id);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

export async function getUserByEmail(email: string): Promise<User> {
  try {
    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

export async function getUnverifiedUserByEmail(email: string): Promise<User> {
  try {
    const user = await userRepository.getUnverifiedUser(email);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

export async function getUserByPhoneNumber(phoneNumber: string): Promise<User> {
  try {
    const user = await userRepository.getUserByPhoneNumber(phoneNumber);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

export async function getAdminUserByEmail(email: string): Promise<User> {
  try {
    const user = await userRepository.getAdminUserByEmail(email);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

export async function getAdminUserByPhoneNumber(
  phoneNumber: string
): Promise<User> {
  try {
    const user = await userRepository.getAdminUserByPhoneNumber(phoneNumber);

    if (!user) {
      throw new ApplicationError('User not found', 404);
    }

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while getting user', 500);
  }
}

export async function createUser(
  payload: ValidRegisterUserPayload
): Promise<User> {
  const { email, phoneNumber, password } = payload;

  try {
    const encryptedPassword = await authService.hashPassword(password);

    const parsedUserWithEncryptedPassword = {
      ...payload,
      image: null,
      password: encryptedPassword
    };

    const verifiedUser =
      await userRepository.getVerifiedUserWithEmailAndPhoneNumber(
        email,
        phoneNumber
      );

    if (verifiedUser) {
      const errorMessage =
        verifiedUser.email === email
          ? 'Email already exists'
          : 'Phone number already exists';

      throw new ApplicationError(errorMessage, 409);
    }

    let user = null;

    const unverifiedUser =
      await userRepository.getUnverifiedUserByEmailAndPhoneNumber(
        email,
        phoneNumber
      );

    if (unverifiedUser) {
      const updatedUser: User = await userRepository.updateUser(
        unverifiedUser.id,
        parsedUserWithEncryptedPassword
      );

      user = updatedUser;
    } else {
      const newUser = await userRepository.createUser(
        parsedUserWithEncryptedPassword
      );

      user = newUser;
    }

    await otpService.sendOtpRequest(email, user.id);

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while creating user', 500);
  }
}

export async function updateUser(
  id: string,
  payload: ValidUpdateUserPayload
): Promise<User> {
  const { email, phoneNumber } = payload;

  try {
    const targetUser = await userRepository.getUserByEmailOrPhoneNumber(
      email,
      phoneNumber
    );

    const isCurrentUser = targetUser?.id === id;
    const isUserNotFound = !targetUser;

    const allowToUpdate = isCurrentUser || isUserNotFound;

    if (!allowToUpdate) {
      const errorMessage =
        targetUser.email === email
          ? 'Email already exists'
          : 'Phone number already exists';

      throw new ApplicationError(errorMessage, 409);
    }

    const parsedPayload = omitPropertiesFromObject<Partial<User>>(payload, [
      'id',
      'roleId',
      'verified',
      'password',
      'createdAt',
      'updatedAt'
    ]);

    const user = await userRepository.updateUser(id, parsedPayload);

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while updating user', 500);
  }
}
