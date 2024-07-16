import * as authService from '../services/auth.js';
import * as userService from '../services/user.js';
import { ApplicationError } from '../utils/error.js';
import type { User } from '@prisma/client';
import type { isValidCredentialPayload } from '../middlewares/validation/auth.js';
import type { isValidRegisterUserPayload } from '../middlewares/validation/user.js';
import type { InferRequest, InferResponse } from '../utils/types/express.js';

export async function register(
  req: InferRequest<typeof isValidRegisterUserPayload>,
  res: InferResponse<typeof isValidRegisterUserPayload>
): Promise<void> {
  const body = req.body;

  try {
    const data = await userService.createUser(body);
    res.status(201).json({ message: 'User created successfully', data: data });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function login(
  req: InferRequest<typeof isValidCredentialPayload>,
  res: InferResponse<typeof isValidCredentialPayload>
): Promise<void> {
  const { email, phoneNumber, password } = req.body;

  try {
    const user = email
      ? await userService.getUserByEmail(email)
      : await userService.getUserByPhoneNumber(phoneNumber);

    // This happens when user login with google oauth
    if (!user.password) {
      res
        .status(404)
        .json({ message: 'Cant get user password, user password is empty' });
      return;
    }

    const isMatch = await authService.isPasswordMatch(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Password doesn't match" });
      return;
    }

    const token = authService.generateToken(user.id);

    const userWithToken = {
      ...user,
      token
    };

    res
      .status(200)
      .json({ message: 'Login successfully', data: userWithToken });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function loginWithAdmin(
  req: InferRequest<typeof isValidCredentialPayload>,
  res: InferResponse<typeof isValidCredentialPayload>
): Promise<void> {
  const { email, phoneNumber, password } = req.body;

  try {
    const user = email
      ? await userService.getAdminUserByEmail(email)
      : await userService.getAdminUserByPhoneNumber(phoneNumber);

    if (!user.password) {
      res
        .status(404)
        .json({ message: 'Cant get user password, user password is empty' });
      return;
    }

    const isMatch = await authService.isPasswordMatch(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Password is not match' });
      return;
    }

    const token = authService.generateToken(user.id);

    const userWithToken: User & { token: string } = {
      ...user,
      token
    };

    res
      .status(200)
      .json({ message: 'Login successfully', data: userWithToken });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
