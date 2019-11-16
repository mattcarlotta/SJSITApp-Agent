import moment from "moment-timezone";
import chalk from "chalk";
import mailer from "@sendgrid/mail";
import config from "env";
import "database";

moment.tz.setDefault("America/Los_Angeles");

mailer.setApiKey(config.sendgridAPIKey);

const { log } = console;

log(
  `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.rgb(
    50,
    168,
    82,
  )("Email service is running...")}`,
);

process.on("exit", () => log(
  `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.rgb(
    34,
    155,
    127,
  )("Email service has been stopped.")}`,
));

// catches ctrl+c event
process.on("SIGINT", () => log(
  `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.magenta(
    "Email service was manully terminated.",
  )}`,
));

// catches "kill pid" (for example: nodemon restart)
// process.on("SIGUSR1", () => {
//   log(
//     `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.magenta(
//       `Email service has been restarted.`,
//     )}`,
//   );
//   process.exit();
// });
// //
// process.on("SIGUSR2", () => {
//   `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.magenta(
//     `Email service has been restarted.`,
//   )}`;
//   process.exit();
// });

// catches uncaught exceptions
process.on("uncaughtException", e => log(
  `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.red(
    `Email service has been stopped due to an error: ${e.stack}.`,
  )}`,
));
