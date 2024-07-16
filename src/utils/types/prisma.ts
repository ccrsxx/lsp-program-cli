import type { PrismaClient } from '@prisma/client';

export type PrismaTransaction = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

export type BaseRecord = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OmitBaseRecord<T extends Record<string, unknown>> = Omit<
  T,
  keyof BaseRecord
>;
