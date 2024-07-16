import { randomBytes, randomInt } from 'crypto';

export function omitPropertiesFromObject<
  T extends Record<string, unknown>,
  U extends keyof T = keyof T
>(object: T, properties: U[]): Omit<T, U> {
  const newObject = { ...object };

  for (const property of properties) {
    delete newObject[property];
  }

  return newObject;
}

export function pickPropertiesFromObject<
  T extends Record<string, unknown>,
  U extends keyof T
>(object: T, properties: U[]): Pick<T, U> {
  const newObject = {} as Pick<T, U>;

  for (const property of properties) {
    newObject[property] = object[property];
  }

  return newObject;
}

export function parseArrayStringToArray(
  arrayString: string | string[]
): string[] | null {
  if (!arrayString) return null;

  const needsParsing = !Array.isArray(arrayString);
  const parsedString = needsParsing
    ? (JSON.parse(arrayString) as string[])
    : arrayString;

  return parsedString;
}

export function generateRandomToken() {
  return randomBytes(24).toString('base64url');
}

export function generateRandomOTP() {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}
