import * as userService from '../services/user.js';
import { ApplicationError } from '../utils/error.js';
import type { InferRequest, InferResponse } from '../utils/types/express.js';
import type { uploadCloudinary } from '../middlewares/upload.js';
import type { isAuthorized } from '../middlewares/auth.js';
import { DOMAIN_URL } from '../utils/env.js';

export function getCurrentUser(
  _req: InferRequest<typeof isAuthorized>,
  res: InferResponse<typeof isAuthorized>
): void {
  const user = res.locals.user;

  res.clearCookie('token', { path: '/', domain: DOMAIN_URL });

  res.status(200).json({ data: user });
}

export async function updateUser(
  req: InferRequest<typeof uploadCloudinary>,
  res: InferResponse<typeof uploadCloudinary>
): Promise<void> {
  const { body } = req;

  const { id: userId } = res.locals.user;

  const image = res.locals.image;

  const bodyWithImage = { ...body, image };

  try {
    const updatedUser = await userService.updateUser(userId, bodyWithImage);

    res.status(200).json({
      message: 'User profile updated successfully',
      data: updatedUser
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
