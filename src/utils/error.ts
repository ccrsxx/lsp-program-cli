import {
  PrismaClientValidationError,
  PrismaClientKnownRequestError
} from '@prisma/client/runtime/library';

export class ApplicationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function generateApplicationError(
  err: unknown,
  message: string,
  statusCode: number
) {
  const assertedError = err as ApplicationError;

  const { message: errorMessage, statusCode: errorStatusCode } = assertedError;

  const isValidationError = [
    PrismaClientValidationError, // Missing required fields, invalid data types, etc.
    PrismaClientKnownRequestError // Unique constraint violation, foreign key constraint violation, etc.
  ].some((error) => err instanceof error);

  const parsedErrorMessage = errorMessage || 'Internal server error';

  const parsedStatusCode = isValidationError
    ? 400
    : errorStatusCode || statusCode;

  return new ApplicationError(
    `${message}: ${parsedErrorMessage}`,
    parsedStatusCode
  );
}
