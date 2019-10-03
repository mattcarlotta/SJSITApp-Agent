/* eslint-disable no-console */
import "middlewares";
import mailer from "@sendgrid/mail";
import moment from "moment";
import { scheduleJob } from "node-schedule";
import { Mail } from "models";

//= ===========================================================//
// CREATE POLLING SERVICES                                      //
//= ===========================================================//

const pollEmails = async () => {
  const startOfDay = moment()
    .startOf("day")
    .toDate();
  const endOfDay = moment()
    .endOf("day")
    .toDate();

  const emails = await Mail.aggregate([
    {
      $match: {
        sendDate: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }
    }
  ]);

  console.log("emails", emails);
};

scheduleJob("*/30 * * * * *", async function() {
  await pollEmails();
});
