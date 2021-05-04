import chalk from "chalk";
import { createDate } from "~helpers";
import { fullDateTimeFormat } from "~utils/dateFormats";

export const errorLogger = (error: Error): void => {
  `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" ERROR ")} ${chalk.rgb(
    255,
    255,
    255
  )(`Error... ${error.toString()}`)}`;
};

export const eventLogger = (emailReminders: Array<any>): void => {
  `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
    `Processed Events... ${emailReminders.length}`
  )}`;
};

export const formCountLogger = (forms: any): void => {
  `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.rgb(
    255,
    255,
    255
  )(`Processed Forms... ${forms}`)}`;
};

export const formLogger = (forms: any): void => {
  `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
    `Processed Forms... ${forms.length}`
  )}\n`;
};

export const initiatedLogger = (): void => {
  `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
    `Polling service was initiated on ${createDate().format(
      fullDateTimeFormat
    )}.`
  )}`;
};

export const mailLogger = (emails: any): void => {
  `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
    `Processed Mail... ${emails.length}`
  )}\n`;
};

export const scheduleLogger = (scheduledEvents: any): void => {
  `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
    `Processed Schedules... ${scheduledEvents.length}`
  )}\n`;
};
