import { uploadToMemory } from '../utils/multer.js';
import { cloudinary } from '../utils/cloudinary.js';
import type { NextFunction } from 'express';
import type { UploadApiErrorResponse } from 'cloudinary';
import type { isAuthorized } from './auth.js';
import type { InferRequest, InferResponse } from '../utils/types/express.js';
import type { isValidUpdateUserPayload } from './validation/user.js';

export function parseImage(
  req: InferRequest<typeof isAuthorized>,
  res: InferResponse<typeof isAuthorized>,
  next: NextFunction
): void {
  uploadToMemory(req, res, (err) => {
    if (err) {
      if (err instanceof Error) {
        res.status(500).json({
          message: `Error while parsing file: ${err.message}`
        });

        return;
      }

      res.status(500).json({
        message: 'Internal server error'
      });

      return;
    }

    next();
  });
}

export async function uploadCloudinary(
  req: InferRequest<typeof isValidUpdateUserPayload, { image: string }>,
  res: InferResponse<typeof isValidUpdateUserPayload, { image: string | null }>,
  next: NextFunction
): Promise<void> {
  const imageFromRequest = req.file;

  if (!imageFromRequest) {
    res.locals.image = req.body?.image ?? null;

    next();
    return;
  }

  const fileBase64 = imageFromRequest.buffer.toString('base64');
  const file = `data:${imageFromRequest.mimetype};base64,${fileBase64}`;

  try {
    const { secure_url } = await cloudinary.uploader.upload(file);

    res.locals.image = secure_url;
  } catch (err) {
    const assertedError = err as UploadApiErrorResponse;
    const isCloudinaryError = 'message' in assertedError;

    if (isCloudinaryError) {
      res.status(500).json({
        message: `Error while uploading file: ${assertedError.message}`
      });

      return;
    }

    res.status(500).json({
      message: 'Internal server error'
    });

    return;
  }

  next();
}
