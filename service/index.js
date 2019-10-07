/* eslint-disable no-console */
import "middlewares";
import mailer from "@sendgrid/mail";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import { scheduleJob } from "node-schedule";
import { Event, Mail } from "models";
import { officialTemplate, scheduleReminder } from "templates";
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
          $lte: endDay,
        },
        status: "unsent",
      },
    },
    { $sort: { sendDate: -1 } },
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
          html: officialTemplate(message),
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

  const events = await Event.find(
    {
      eventDate: {
        $gte: startDay,
        $lte: endDay,
      },
      sentEmailReminders: false,
    },
    {
      eventDate: 1,
      eventType: 1,
      location: 1,
      notes: 1,
      opponent: 1,
      schedule: 1,
      team: 1,
      uniform: 1,
    },
    { sort: { eventDate: 1 } },
  )
    .populate({
      path: "schedule.employeeIds",
      select: "_id firstName lastName email",
    })
    .lean();

  if (!isEmpty(events)) {
    const eventIds = events.map(({ _id }) => _id);
    const emailReminders = [];

    events.forEach(({ _id, schedule, eventDate, ...rest }) => {
      schedule.forEach(({ employeeIds, title }) => {
        if (!isEmpty(employeeIds)) {
          employeeIds.forEach(({ firstName, lastName, email }) => {
            const eventDateToString = moment(eventDate).format(
              "MMMM Do, YYYY @ h:mm a",
            );
            emailReminders.push({
              sendTo: `${firstName} ${lastName} <${email}>`,
              sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
              subject: `Event Reminder for ${eventDateToString}`,
              message: scheduleReminder({
                callTime: title,
                eventDate: eventDateToString,
                ...rest,
              }),
            });
          });
        }
      });
    });

    if (!isEmpty(emailReminders)) await Mail.insertMany(emailReminders);
    await Event.updateMany(
      {
        _id: { $in: eventIds },
      },
      { $set: { sentEmailReminders: true } },
    );
  }
};

scheduleJob("*/30 * * * * *", async function() {
  await pollEvents();
  await pollEmails();
});
