/* eslint-disable no-console */

import chalk from 'chalk';
import { state } from '../utils/state.js';
import { backToMainMenu, showLogo } from '../utils/ui.js';
import { logExecutionResource } from '../utils/helper.js';
import { bubbleSort } from '../logic/sort.js';

export async function sortNumbers(): Promise<void> {
  await showLogo();

  if (!state.numbers.length) {
    console.log(chalk.red('No numbers to sort'), '\n');

    await backToMainMenu();

    return;
  }

  console.log(chalk.magenta('Numbers:'), state.numbers.join(', '), '\n');

  logExecutionResource(() => {
    const sortedNumbers = bubbleSort(state.numbers, 'asc');

    console.log(chalk.blue('Sorted Numbers:'), sortedNumbers.join(', '), '\n');
  });

  await backToMainMenu();
}
