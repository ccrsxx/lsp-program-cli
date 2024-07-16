/* eslint-disable no-console */

import chalk from 'chalk';
import { state } from '../utils/state.js';
import { confirm } from '@inquirer/prompts';
import { showLogo } from '../utils/helper.js';

export async function sortNumbers(): Promise<void> {
  await showLogo();

  console.log(chalk.magenta('Numbers:'), state.numbers.join(', '));

  state.numbers.sort((a, b) => a - b);

  console.log(chalk.blue('Sorted Numbers:'), state.numbers.join(', '), '\n');

  await confirm({ message: 'Press Enter to continue' });
}
