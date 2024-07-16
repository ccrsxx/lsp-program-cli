import dotenv from 'dotenv';
import { access } from 'fs/promises';

const isRunningInDevelopment = process.env.NODE_ENV === 'development';

if (isRunningInDevelopment) {
  const isLocalEnvExists = await access('.env.local')
    .then(() => true)
    .catch(() => false);

  if (!isLocalEnvExists) {
    throw new Error('Local environment file (.env.local) is missing');
  }

  const envPath = '.env.local';

  // eslint-disable-next-line no-console
  console.info(`Loading environment variables from ${envPath}`);

  dotenv.config({
    path: envPath
  });
}

const { HEROKU_APP_NAME, HEROKU_PR_NUMBER } = process.env;

export const PUBLIC_URL = HEROKU_APP_NAME
  ? `https://${HEROKU_APP_NAME}.herokuapp.com`
  : process.env.PUBLIC_URL;

export const DB_DATABASE = HEROKU_PR_NUMBER
  ? `pr_${HEROKU_PR_NUMBER}`
  : process.env.DB_DATABASE;

export let DATABASE_URL = process.env.DATABASE_URL;

if (HEROKU_PR_NUMBER) {
  DATABASE_URL = DATABASE_URL?.replace(
    `${DATABASE_URL}?schema=public`,
    `${HEROKU_PR_NUMBER}?schema=public`
  );
}

export const HOST_PORT = process.env.PORT ?? process.env.HOST_PORT;

export const {
  JWT_SECRET,
  DOMAIN_URL,
  FRONTEND_URL,
  EMAIL_ADDRESS,
  EMAIL_PASSWORD,
  GOOGLE_CLIENT_ID,
  CLOUDINARY_API_KEY,
  GOOGLE_REDIRECT_URL,
  GOOGLE_CLIENT_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET
} = process.env as Record<string, string>;
