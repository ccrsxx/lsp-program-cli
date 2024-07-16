import { rawlist } from '@inquirer/prompts';
import { sortNumbers } from './sort.js';
import { inputNumbers } from './input.js';
import { searchNumbers } from './search.js';
import { showLogo, showLoadingSpinner, quitCli } from '../utils/helper.js';

export async function showMenu(): Promise<void> {
  await showLogo();

  const menu = [
    'quit_cli',
    'sort_numbers',
    'input_numbers',
    'search_numbers'
  ] as const;

  type Menu = (typeof menu)[number];

  const answer = await rawlist<Menu>({
    message: 'Choose Menu',
    choices: [
      {
        name: 'Input Numbers',
        value: 'input_numbers'
      },
      {
        name: 'Sort Numbers',
        value: 'sort_numbers'
      },
      {
        name: 'Search Numbers',
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
}
