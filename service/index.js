import "middlewares";
import chalk from "chalk";
import moment from "moment";
import { scheduleJob } from "node-schedule";
import pollEmails from "./pollEmails";
import pollEvents from "./pollEvents";

const { log } = console;

//= ===========================================================//
// CREATE POLLING SERVICES                                     //
//= ===========================================================//

scheduleJob("*/30 * * * * *", async function() {
  log(
    `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.blue(
      `Polling service was initiated on ${moment(Date.now()).format(
        "MMMM Do YYYY @ h:mm:ss a",
      )}.`,
    )}`,
  );

  await pollEvents();
  await pollEmails();
});
