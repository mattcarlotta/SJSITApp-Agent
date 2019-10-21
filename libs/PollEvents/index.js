import moment from "moment";
import isEmpty from "lodash/isEmpty";
import { eventLogger } from "loggers";
import { Event, Mail } from "models";
import { scheduleReminder } from "templates";
import { endOfTomorrow } from "shared/helpers";

export default async () => {
  const events = await Event.find(
    {
      eventDate: {
        $lte: endOfTomorrow(),
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
  /* istanbul ignore next */
  if (!isEmpty(events)) {
    const eventIds = events.map(({ _id }) => _id);

    events.forEach(({
      _id, schedule, eventDate, ...rest
    }) => {
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

    /* istanbul ignore next */
    if (!isEmpty(emailReminders)) {
      await Mail.insertMany(emailReminders);
      await Event.updateMany(
        {
          _id: { $in: eventIds },
        },
        { $set: { sentEmailReminders: true } },
      );
    }
  }

  console.log(eventLogger(emailReminders));
};
