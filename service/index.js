/* eslint-disable no-console */
import "middlewares";
import mailer from "@sendgrid/mail";
import isEmpty from "lodash/isEmpty";
import { scheduleJob } from "node-schedule";
import { Event, Mail } from "models";
import { officialTemplate } from "templates";
import { endOfDay, startOfDay } from "shared/helpers";

//= ===========================================================//
// CREATE POLLING SERVICES                                     //
//= ===========================================================//

const pollEmails = async () => {
  const startDay = startOfDay();
  const endDay = endOfDay();

  const emails = await Mail.aggregate([
    {
      $match: {
        sendDate: {
          $gte: startDay,
          $lte: endDay
        },
        status: "unsent"
      }
    },
    { $sort: { sendDate: -1 } }
  ]);

  if (!isEmpty(emails)) {
    for (let i = 0; i < emails.length; i++) {
      const existingMail = emails[i];
      const { _id, message, sendFrom, sendTo, subject } = existingMail;

      await mailer
        .send({
          to: sendTo,
          from: sendFrom,
          subject,
          html: officialTemplate(message)
        })
        .then(async () => {
          await Mail.updateOne({ _id }, { status: "sent" });
        })
        .catch(async error => {
          const { message } = error;
          await Mail.updateOne({ _id }, { status: `failed - ${message}` });
        });
    }
  }
};

const pollEvents = async () => {
  const startDay = startOfDay();
  const endDay = endOfDay();

  const events = await Event.aggregate([
    {
      $match: {
        eventDate: {
          $gte: startDay,
          $lte: endDay
        },
        sentEmailReminders: false
      }
    },
    { $sort: { eventDate: -1 } }
  ]);

  console.log("events", events);

  // if (!isEmpty(events)) {
  //   for (let i = 0; i < emails.length; i++) {
  //     const existingMail = emails[i];
  //     const { _id, message, sendFrom, sendTo, subject } = existingMail;
  //
  //     await mailer
  //       .send({
  //         to: sendTo,
  //         from: sendFrom,
  //         subject,
  //         html: officialTemplate(message)
  //       })
  //       .then(async () => {
  //         await Mail.updateOne({ _id }, { status: "sent" });
  //       })
  //       .catch(async error => {
  //         const { message } = error;
  //         await Mail.updateOne({ _id }, { status: `failed - ${message}` });
  //       });
  //   }
  // }
};

scheduleJob("*/30 * * * * *", async function() {
  await pollEmails();
  // await pollEvents();
});
