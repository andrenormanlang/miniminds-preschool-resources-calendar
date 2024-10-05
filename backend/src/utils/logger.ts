import chalk from 'chalk';

export const logInfo = (message: string) => {
  console.log(chalk.blue(`[INFO]: ${message}`));
};

export const logError = (message: string) => {
  console.error(chalk.red(`[ERROR]: ${message}`));
};
