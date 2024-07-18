/* eslint-disable no-console */

import chalk from 'chalk';
import gradient from 'gradient-string';
import { confirm } from '@inquirer/prompts';
import { createSpinner } from 'nanospinner';
import { state } from './state.js';
import { figletAsync, sleep } from './helper.js';
import { CancelPromptError, ExitPromptError } from '@inquirer/core';

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

export async function backToMainMenu(): Promise<boolean> {
  const answerPrompt = confirm({
    message: 'Press Escape or Enter to go back to main menu',
    theme: {
      style: {
        defaultAnswer: () => ''
      }
    }
  });

  state.cancelablePrompt = answerPrompt;

  try {
    const answer = await answerPrompt;

    return answer;
  } catch (err) {
    if (err instanceof CancelPromptError) return false;
    if (err instanceof ExitPromptError) await quitCli();

    console.log(chalk.red('Error has occurred!'));

    return false;
  }
}
