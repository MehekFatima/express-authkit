import chalk from 'chalk';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const colors = {
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
  debug: chalk.gray,
};

export function log(level: LogLevel, message: string) {
  const color = colors[level] || ((msg: string) => msg);
  const prefix = `[${level.toUpperCase()}]`;
  console.log(color(`${prefix} ${message}`));
}

export const info = (msg: string) => log('info', msg);
export const warn = (msg: string) => log('warn', msg);
export const error = (msg: string) => log('error', msg);
export const debug = (msg: string) => log('debug', msg);
