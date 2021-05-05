import chalk from "chalk";

const { log } = console;

/**
 * Helper function to log an error to console.
 *
 * @function errorMessage
 * @param error - string;
 */
export const errorMessage = (error: string): void => {
  log(
    `\n${chalk.rgb(255, 255, 255).bgRgb(255, 17, 0)(" ERROR ")} ${chalk.red(
      `${error}`
    )}\n`
  );
};

/**
 * Helper function to log an info to console.
 *
 * @function infoMessage
 * @param message - string;
 */
export const infoMessage = (message: string): void => {
  log(
    `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
      `${message}`
    )}`
  );
};

/**
 * Helper function to log a warning to console.
 *
 * @function warnMessage
 * @param message - string;
 */
export const warnMessage = (message: string): void => {
  log(
    `\n${chalk.rgb(255, 255, 255).bgRgb(201, 162, 4)(" WARN ")} ${chalk.yellow(
      `${message}`
    )}`
  );
};
