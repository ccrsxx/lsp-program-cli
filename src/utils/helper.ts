/* eslint-disable no-console */

import figlet from 'figlet';
import gradient from 'gradient-string';
import { createSpinner } from 'nanospinner';

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

export async function showLogo(): Promise<void> {
  console.clear();

  const figletString = await figletAsync('LSP CLI!');

  console.log(gradient.pastel.multiline(figletString));
}

export async function quitCli(): Promise<void> {
  console.clear();

  const figletString = await figletAsync('Good Bye!');

  console.log(gradient.pastel.multiline(figletString));

  process.exit(0);
}

export async function showLoadingSpinner(): Promise<void> {
  const spinner = createSpinner('Loading...').start();

  await sleep(500);

  spinner.stop();
}
