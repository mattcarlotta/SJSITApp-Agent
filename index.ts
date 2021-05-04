import { scheduleJob } from "node-schedule";
import "~middlewares";
import { createDate } from "~helpers";
import {
  generateStaffSchedule,
  generateFormReminders,
  pollEmails,
  pollEvents,
  pollForms,
  pollNHLAPI,
  generateEmployeeSchedules
} from "~libs";
import { infoMessage, warnMessage } from "~loggers";
import { fullDateTimeFormat } from "~utils/dateFormats";

//= ===========================================================//
// CREATE POLLING SERVICES                                     //
//= ===========================================================//

if (process.env.ONLINE) {
  scheduleJob("*/30 * * * * *", async () => {
    const currentDate = createDate();

    infoMessage(
      `Polling service was initiated on ${currentDate.format(
        fullDateTimeFormat
      )}.`
    );

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
  warnMessage("The emailing microservice is currently offline");
}
