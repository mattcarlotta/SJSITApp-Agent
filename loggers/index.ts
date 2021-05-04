import chalk from "chalk";
import { createDate } from "~helpers";
import { fullDateTimeFormat } from "~utils/dateFormats";

export const errorMessage = (error: string): void => {
  console.log(
    `\n${chalk.rgb(255, 255, 255).bgRgb(255, 17, 0)(" ERROR ")} ${chalk.red(
      `${error}`
    )}\n`
  );
};

export const infoMessage = (message: string): void => {
  console.log(
    `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
      `${message}`
    )}`
  );
};

export const initiatedLogger = (): void => {
  infoMessage(
    `Polling service was initiated on ${createDate().format(
      fullDateTimeFormat
    )}.`
  );
};
