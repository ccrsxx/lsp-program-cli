/* eslint-disable no-console */
/* eslint-disable no-constant-condition */

import chalk from 'chalk';
import { state } from '../utils/state.js';
import { number } from '@inquirer/prompts';
import { showLogo, quitCli } from '../utils/ui.js';
import { CancelPromptError, ExitPromptError } from '@inquirer/core';

export async function inputNumbers(): Promise<void> {
  await showLogo();

  const numberOfInputsPrompt = number({
    message: 'How many numbers do you want to input?',
    required: true,
    validate: (value: number | undefined) => {
      const isNotValid = typeof value === 'number' && value < 1;

      if (isNotValid) return 'Number of inputs must be greater than 0';

      return true;
    }
  });

  state.cancelablePrompt = numberOfInputsPrompt;

  let inputArrays: number[] = [];

  try {
    const numberOfInputs = (await numberOfInputsPrompt) as number;

    console.log();

    for (let i = 0; i < numberOfInputs; i++) {
      const inputPrompt = number({
        message: `Input number ${i + 1}`,
        required: true,
        theme: {
          style: {
            message: (text: string) => `${text} ${chalk.blue('>>')}`
          }
        }
      });

      state.cancelablePrompt = inputPrompt;

      const parsedInput = (await inputPrompt) as number;

      inputArrays.push(parsedInput);
    }
  } catch (err) {
    if (err instanceof CancelPromptError) inputArrays = [];
    if (err instanceof ExitPromptError) await quitCli();

    console.log(chalk.red('Error has occurred!'));
  }

  if (inputArrays.length) state.numbers = inputArrays;
}
