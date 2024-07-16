import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { json } from 'express';
import { HOST_PORT, FRONTEND_URL } from './utils/env.js';
import root from './routes/index.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import userNotifications from './routes/user-notifications.js';

function main() {
  const app = express();

  // Middlewares
  app.use(
    json(),
    cors({ origin: FRONTEND_URL, credentials: true }),
    cookieParser()
  );

  // Routes
  root(app);
  auth(app);
  users(app);
  userNotifications(app);

  app.listen(HOST_PORT, () =>
    // eslint-disable-next-line no-console
    console.info(`Server running on port ${HOST_PORT}`)
  );
}

main();
