import "middlewares";
import { scheduleJob } from "node-schedule";
import {
  pollEmails, pollEvents, pollForms, pollSchedules,
} from "libs";
import { initiatedLogger } from "loggers";

//= ===========================================================//
// CREATE POLLING SERVICES                                     //
//= ===========================================================//

scheduleJob("*/30 * * * * *", async () => {
  console.log(initiatedLogger());

  await pollForms();
  await pollEvents();
  await pollEmails();
});

// scheduleJob("*/5 * * * * *", async () => {
//   await pollSchedules();
// });

scheduleJob("59 7 25 * *", async () => {
  await pollSchedules();
});
