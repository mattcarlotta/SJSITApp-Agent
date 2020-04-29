import moment from "moment-timezone";
import chalk from "chalk";
import mailer from "@sendgrid/mail";
import "~database";

const { sendgridAPIKey } = process.env;

moment.tz.setDefault("America/Los_Angeles");

mailer.setApiKey(sendgridAPIKey);

const { log } = console;

process.on("exit", () =>
  log(
    `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
      "Email service has been stopped."
    )}\n`
  )
);

// catches ctrl+c event
process.on("SIGINT", () =>
  log(
    `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.magenta(
      "Email service was manully terminated."
    )}`
  )
);

// catches uncaught exceptions
process.on("uncaughtException", e =>
  log(
    `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" ERROR ")} ${chalk.red(
      `Email service has been stopped due to an error: ${e.stack}.`
    )}`
  )
);
