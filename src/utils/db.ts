import { DATABASE_URL } from './env.js';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  datasourceUrl: DATABASE_URL
});
