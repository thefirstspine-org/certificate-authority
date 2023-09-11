#!/usr/bin/env node

import { GenerateCommand } from "./generate.command";

// Bootstrap the command
const command: GenerateCommand = new GenerateCommand();

// Get options
var argv = require('minimist')(process.argv.slice(2));
if (argv['m'] == undefined) {
  console.log('-[m]ode option is missing');
  process.exit(1);
}

command.start({
  mode: argv['m'],
  key: argv['k'],
  certificate: argv['c'],
});
