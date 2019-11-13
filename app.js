import "middlewares";
import { scheduleJob } from "node-schedule";
import {
  pollEmails, pollEvents, pollForms, pollSchedules,
} from "libs";
import { initiatedLogger } from "loggers";

//= ===========================================================//
// CREATE POLLING SERVICES                                     //
//= ===========================================================//

// scheduleJob("*/5 * * * * *", async () => {
//   console.log(initiatedLogger());
//
//   await pollForms();
//   await pollEvents();
//   await pollEmails();
// });

scheduleJob("*/30 * * * * *", async () => {
  console.log(initiatedLogger());

  await pollForms();
  await pollEvents();
  await pollEmails();
});

// scheduleJob("*/7 * * * * *", async () => {
//   await pollSchedules();
//   await pollEmails();
// });

scheduleJob("00 18 15 * *", async () => {
  await pollSchedules();
});
