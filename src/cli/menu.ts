/* eslint-disable no-constant-condition */

import { rawlist } from '@inquirer/prompts';
import { sortNumbers } from './sort.js';
import { inputNumbers } from './input.js';
import { searchNumbers } from './search.js';
import { showLogo, showLoadingSpinner, quitCli } from '../utils/ui.js';

export async function showMenu(): Promise<void> {
  while (true) {
    await showLogo();

    const menu = [
      'quit_cli',
      'sort_numbers',
      'input_numbers',
      'search_numbers'
    ] as const;

    type Menu = (typeof menu)[number];

    try {
      const answer = await rawlist<Menu>({
        message: 'Choose menu',
        choices: [
          {
            name: 'Input numbers',
            value: 'input_numbers'
          },
          {
            name: 'Sort numbers',
            value: 'sort_numbers'
          },
          {
            name: 'Search numbers',
            value: 'search_numbers'
          },
          {
            name: 'Quit',
            value: 'quit_cli'
          }
        ]
      });

      await showLoadingSpinner();

      switch (answer) {
        case 'input_numbers':
          await inputNumbers();
          break;
        case 'sort_numbers':
          await sortNumbers();
          break;
        case 'search_numbers':
          await searchNumbers();
          break;
        case 'quit_cli':
          await quitCli();
          break;
        default:
          break;
      }
    } catch {
      break;
    }
  }
}
