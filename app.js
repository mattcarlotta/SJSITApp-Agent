import "middlewares";
import { scheduleJob } from "node-schedule";
import {
  pollEmails,
  pollEvents,
  pollForms,
  pollNHLAPI,
  pollSchedules,
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

scheduleJob("*/5 * * * *", async () => {
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

// scheduleJob("*/5 * * * * *", async () => {
//   await pollNHLAPI();
// });

scheduleJob("59 7 16 * *", async () => {
  await pollNHLAPI();
});
