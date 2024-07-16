import * as userService from './user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../utils/env.js';
import { generateApplicationError } from '../utils/error.js';
import type { JwtPayload } from 'jsonwebtoken';
import type { User } from '@prisma/client';

export async function hashPassword(
  password: string,
  salt = 10
): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw generateApplicationError(err, 'Error while hashing password', 500);
  }
}

export async function isPasswordMatch(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (err) {
    throw generateApplicationError(err, 'Error while comparing password', 500);
  }
}

export function generateToken(id: string): string {
  try {
    const token = jwt.sign({ id }, JWT_SECRET, {
      expiresIn: '1d'
    });
    return token;
  } catch (err) {
    throw generateApplicationError(err, 'Error while generating token', 500);
  }
}

export async function verifyToken(token: string): Promise<User> {
  try {
    const { id } = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      id: string;
    };

    const user = await userService.getUser(id);

    return user;
  } catch (err) {
    throw generateApplicationError(err, 'Error while verifying token', 500);
  }
}
