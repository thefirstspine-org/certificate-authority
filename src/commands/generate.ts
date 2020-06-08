#!/usr/bin/env node

import { GenerateCommand } from "./generate.command";
import yargs from 'yargs';

// Clear the console
const clear = require('clear');
clear();

yargs
  .command('', 'Generates files to be validated in the services.')
  .options({
    force: {
      alias: 'f',
      type: 'boolean',
      description: 'Once provided, the confirmation prompt will be ignored.',
      default: false,
    },
    mode: {
      alias: 'm',
      type: 'string',
      description: 'Defines wha\'s to be generated. `"ask"` or `"pair"`. If not provided, a prompt will be displayed.',
      default: 'ask',
    },
    key: {
      alias: 'k',
      type: 'string',
      description: 'The private key path. If not provided, a prompt will be displayed. If the file already exists, a confirmation will be asked',
      default: false,
    },
    certificate: {
      alias: 'c',
      type: 'string',
      description: 'The public certificate path. If not provided, a prompt will be displayed. If the file already exists, a confirmation will be asked',
      default: false,
    },
  });

// Bootstrap the command
const command: GenerateCommand = new GenerateCommand();
const args = yargs.parse();
command.start({
  force: args.force as boolean,
  mode: args.mode as string,
  key: args.key as string,
  certificate: args.certificate as string,
});
