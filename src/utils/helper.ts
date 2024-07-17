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

export function logExecutionResource(callback: () => void): void {
  const start = performance.now();

  callback();

  const end = performance.now();

  const time = end - start;

  const { heapUsed } = process.memoryUsage();

  console.log(`Time execution: ${(time / 1000).toFixed(2)} Seconds`);

  console.log(`Memory usage: ${formatMemoryUsage(heapUsed)}`, '\n');
}
