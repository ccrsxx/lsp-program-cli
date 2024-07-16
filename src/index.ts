#!/usr/bin/env node

/* eslint-disable no-constant-condition */

import { showMenu } from './cli/menu.js';
import { quitCli } from './utils/helper.js';
import './utils/event.js';

/**
 * Main function to run the CLI.
 */
export async function main(): Promise<void> {
  while (true) {
    try {
      await showMenu();
    } catch {
      break;
    }
  }

  await quitCli();
}

void main();

export { showMenu } from './cli/menu.js';
export { quitCli } from './utils/helper.js';
