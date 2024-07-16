import * as authService from './auth.js';
import * as userRepository from '../repositories/user.js';
import { oauth2, oauth2Client } from '../utils/oauth.js';
import { ApplicationError, generateApplicationError } from '../utils/error.js';
import type { oauth2_v2 as Oauth2Type } from '@googleapis/oauth2';

export async function getGoogleUserInfo(
  code: string
): Promise<Oauth2Type.Schema$Userinfo> {
  try {
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const { data } = await oauth2.userinfo.get();

    return data;
  } catch (err) {
    throw generateApplicationError(
      err,
      'Error while get user info account google',
      500
    );
  }
}

export type PayloadCreateUserWithoutOtp = {
  name: string;
  email: string;
  image: string | null | undefined;
};

export async function checkOauthLoginOrRegisterUser(
  data: Oauth2Type.Schema$Userinfo
): Promise<string> {
  try {
    const { email, name, picture } = data;

    const isRequiredFieldsEmpty = !email || !name;

    if (isRequiredFieldsEmpty) {
      throw new ApplicationError('Email or name is empty', 400);
    }

    let user = await userRepository.getUserByEmail(email);

    if (!user) {
      const payload: PayloadCreateUserWithoutOtp = {
        name: name,
        email: email,
        image: picture
      };

      user = await userRepository.createVerifiedUser(payload);
    }

    const token = authService.generateToken(user.id);

    return token;
  } catch (err) {
    throw generateApplicationError(err, 'Error while login with oauth', 500);
  }
}
