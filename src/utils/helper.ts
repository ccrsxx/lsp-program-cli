/* eslint-disable no-console */

import figlet from 'figlet';

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function figletAsync(message: string): Promise<string> {
  return new Promise((resolve, reject) =>
    figlet(message, (err, data) => {
      if (err) reject(err);

      resolve(data as string);
    })
  );
}

export function formatMemoryUsage(value: number): string {
  return `${Math.round((value / 1024 / 1024) * 100) / 100} MB`;
}

export function logExecutionResource(
  callback: () => void,
  manual?: false
): null;

export function logExecutionResource(
  callback: () => void,
  manual: true
): () => void;

export function logExecutionResource(
  callback: () => void,
  manual: boolean = false
): (() => void) | null {
  const start = performance.now();

  callback();

  const end = performance.now();

  const time = end - start;

  const { heapUsed } = process.memoryUsage();

  function printOutput(): void {
    console.log(`Time execution: ${time.toFixed(2)} MS`);

    console.log(`Memory usage: ${formatMemoryUsage(heapUsed)}`, '\n');
  }

  let returnValue: (() => void) | null = null;

  if (manual) returnValue = printOutput;
  else printOutput();

  return returnValue;
}
