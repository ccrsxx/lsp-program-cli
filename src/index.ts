#!/usr/bin/env node

import { showMenu } from './cli/menu.js';
import { quitCli } from './utils/ui.js';
import './utils/event.js';

async function main(): Promise<void> {
  await showMenu();
  await quitCli();
}

void main();
