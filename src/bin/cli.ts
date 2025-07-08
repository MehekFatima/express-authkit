#!/usr/bin/env node
import 'dotenv/config'; 

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';

import { createUserCommand } from './commands/createUser';
import { signCommand } from './commands/signToken';
import { verifyCommand } from './commands/verifyToken';
import { refreshCommand } from './commands/refreshToken';
import { decodeCommand } from './commands/decodeToken';
import { logoutCommand } from './commands/logoutToken';
import { setCookieTokenCommand } from './commands/setCookieToken';

console.log(
  chalk.blue(figlet.textSync('AuthKit CLI', { horizontalLayout: 'fitted' }))
);
console.log(chalk.green("🔐 Powered by Mehek Fatima's Express AuthKit\n"));

const program = new Command();

program
  .name('express-authx')
  .description('A dev-friendly CLI for JWT-based auth')
  .version('1.0.0');

program
  .addCommand(createUserCommand)
  .addCommand(signCommand)
  .addCommand(verifyCommand)
  .addCommand(refreshCommand)
  .addCommand(decodeCommand)
  .addCommand(logoutCommand)
  .addCommand(setCookieTokenCommand);

program.parse(process.argv);
