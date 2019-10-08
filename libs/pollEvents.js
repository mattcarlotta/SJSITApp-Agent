import chalk from "chalk";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import { Event, Mail } from "models";
import { scheduleReminder } from "templates";
import { endOfDay, startOfDay } from "shared/helpers";

const { log } = console;

export default async () => {
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

  const emailReminders = [];
  if (!isEmpty(events)) {
    const eventIds = events.map(({ _id }) => _id);

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

  log(
    `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.rgb(
      255,
      255,
      255,
    )(`Processed Events... ${emailReminders.length}`)}`,
  );
};
