/* eslint-disable no-console */
/* eslint-disable no-constant-condition */

import chalk from 'chalk';
import { state } from '../utils/state.js';
import { number } from '@inquirer/prompts';
import { showLogo, quitCli } from '../utils/helper.js';
import { CancelPromptError, ExitPromptError } from '@inquirer/core';

export async function searchNumbers(): Promise<void> {
  let message: string | null = null;

  while (true) {
    await showLogo();

    console.log(chalk.magenta('Numbers:'), state.numbers.join(', '), '\n');

    console.log(chalk.blue('Press Escape to stop input\n'));

    if (message) console.log(message, '\n');

    const answerPrompt = number({
      message: 'Search Number',
      required: true
    });

    state.cancelablePrompt = answerPrompt;

    try {
      const parsedAnswer = (await answerPrompt) as number;

      const isFound = state.numbers.includes(parsedAnswer);

      if (isFound) message = chalk.green(`Number ${parsedAnswer} is found!`);
      else message = chalk.red(`Number ${parsedAnswer} is not found!`);
    } catch (err) {
      if (err instanceof CancelPromptError) break;
      if (err instanceof ExitPromptError) await quitCli();

      console.log(chalk.red('Error has occurred!'));
    }
  }
}
