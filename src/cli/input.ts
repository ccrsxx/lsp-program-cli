/* eslint-disable no-console */
/* eslint-disable no-constant-condition */

import chalk from 'chalk';
import { state } from '../utils/state.js';
import { number } from '@inquirer/prompts';
import { showLogo, quitCli } from '../utils/helper.js';
import { CancelPromptError, ExitPromptError } from '@inquirer/core';

export async function inputNumbers(): Promise<void> {
  while (true) {
    await showLogo();

    console.log(chalk.magenta('Numbers:'), state.numbers.join(', '), '\n');

    console.log(chalk.blue('Press Escape to stop input\n'));

    const answerPrompt = number({
      message: 'Input Number',
      required: true
    });

    state.cancelablePrompt = answerPrompt;

    try {
      const parsedAnswer = (await answerPrompt) as number;

      state.numbers.push(parsedAnswer);
    } catch (err) {
      if (err instanceof CancelPromptError) break;
      if (err instanceof ExitPromptError) await quitCli();

      console.log(chalk.red('Error has occurred!'));
    }
  }
}
