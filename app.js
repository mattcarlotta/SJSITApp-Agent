import chalk from "chalk";
import { scheduleJob } from "node-schedule";
import "~middlewares";
import {
  generateStaffSchedule,
  generateFormReminders,
  pollEmails,
  pollEvents,
  pollForms,
  pollNHLAPI,
  generateEmployeeSchedules
} from "~libs";
import { initiatedLogger } from "~loggers";

//= ===========================================================//
// CREATE POLLING SERVICES                                     //
//= ===========================================================//

if (process.env.ONLINE) {
  scheduleJob("*/30 * * * * *", async () => {
    console.log(initiatedLogger());

    await pollForms();
    await pollEvents();
    await pollEmails();
  });

  //= ===========================================================//
  // SCHEDULES                                                   //
  //= ===========================================================//

  // send out individual schedules to employees on the 15th of every month @ 6pm
  scheduleJob("0 18 15 * *", () => generateEmployeeSchedules());

  // send out a master schedule to the staff on the 15th of every month @ 7pm
  scheduleJob("0 19 15 * *", () => generateStaffSchedule());

  //= ===========================================================//
  // EVENTS & AP FORMS                                           //
  //= ===========================================================//

  // send out A/P form reminders to employees on the 5th of every month @ 6pm
  scheduleJob("0 18 5 * *", () => generateFormReminders());

  // retrieve next month's events from API and generate next months A/P form
  // on the 16th of every month @ 7:59am
  scheduleJob("59 7 16 * *", () => pollNHLAPI());
} else {
  console.log(
    `\n${chalk.rgb(255, 255, 255).bgRgb(201, 162, 4)(" WARN ")} ${chalk.yellow(
      `The emailing microservice is currently offline`
    )}`
  );
}
