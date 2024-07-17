/* eslint-disable no-console */
/* eslint-disable no-constant-condition */

import chalk from 'chalk';
import { state } from '../utils/state.js';
import { number } from '@inquirer/prompts';
import { showLogo, quitCli, backToMainMenu } from '../utils/ui.js';
import { CancelPromptError, ExitPromptError } from '@inquirer/core';
import { logExecutionResource } from '../utils/helper.js';

export async function searchNumbers(): Promise<void> {
  let message: string | null = null;
  let logExecutionCallback: (() => void) | null = null;

  while (true) {
    await showLogo();

    if (!state.numbers.length) {
      console.log(chalk.red('No numbers to search'), '\n');

      await backToMainMenu();

      return;
    }

    console.log(chalk.magenta('Numbers:'), state.numbers.join(', '), '\n');

    console.log(chalk.blue('Press Escape to stop input\n'));

    if (message) {
      console.log(message, '\n');
      logExecutionCallback?.();
    }

    const answerPrompt = number({
      message: 'Search number',
      required: true
    });

    state.cancelablePrompt = answerPrompt;

    try {
      const parsedAnswer = (await answerPrompt) as number;

      logExecutionCallback = logExecutionResource(() => {
        const isFound = state.numbers.includes(parsedAnswer);

        if (isFound) message = chalk.green(`Number ${parsedAnswer} is found!`);
        else message = chalk.red(`Number ${parsedAnswer} is not found!`);
      }, true);
    } catch (err) {
      if (err instanceof CancelPromptError) break;
      if (err instanceof ExitPromptError) await quitCli();

      console.log(chalk.red('Error has occurred!'));
    }
  }
}
