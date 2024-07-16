import * as oauthService from '../services/oauth.js';
import { ApplicationError } from '../utils/error.js';
import { authorizationUrl } from '../utils/oauth.js';
import { DOMAIN_URL, FRONTEND_URL } from '../utils/env.js';
import type { Request, Response } from 'express';
import type { NormalizedResponse } from '../utils/types/express.js';

export function getGoogleAuthorizationUrl(
  _req: Request,
  res: Response<NormalizedResponse<unknown, { redirectTo: string }>>
): void {
  res.redirect(authorizationUrl);
}

export async function authenticateWithGoogle(
  req: Request<unknown, unknown, unknown, { code: string }>,
  res: Response<NormalizedResponse>
): Promise<void> {
  try {
    const { code } = req.query;

    if (!code) {
      throw new ApplicationError('Parameter code is not found', 404);
    }

    const userData = await oauthService.getGoogleUserInfo(code);

    const userToken =
      await oauthService.checkOauthLoginOrRegisterUser(userData);

    res.cookie('token', userToken, {
      path: '/',
      domain: DOMAIN_URL,
      maxAge: 1 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.redirect(`${FRONTEND_URL}`);
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
