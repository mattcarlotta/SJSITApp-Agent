import "middlewares";
import { scheduleJob } from "node-schedule";
import { pollEmails, pollEvents, pollForms } from "libs";
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
