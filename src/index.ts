#!/usr/bin/env node

/* eslint-disable no-constant-condition */

import { showMenu } from './cli/menu.js';
import { quitCli } from './utils/helper.js';
import './utils/event.js';

async function main(): Promise<void> {
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
