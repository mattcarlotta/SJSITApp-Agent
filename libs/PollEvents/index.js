import isEmpty from "lodash.isempty";
import { eventLogger } from "~loggers";
import { Event, Mail } from "~models";
import { eventReminder } from "~templates";
import { createDate, endOfTomorrow } from "~helpers";
import moment from "~utils/momentWithTimeZone";

export default async () => {
  const events = await Event.find(
    {
      eventDate: {
        $lte: endOfTomorrow()
      },
      sentEmailReminders: false
    },
    {
      eventDate: 1,
      eventType: 1,
      location: 1,
      notes: 1,
      opponent: 1,
      schedule: 1,
      team: 1,
      uniform: 1
    },
    { sort: { eventDate: 1 } }
  )
    .populate({
      path: "schedule.employeeIds",
      select: "_id firstName lastName email emailReminders"
    })
    .lean();

  const emailReminders = [];
  /* istanbul ignore next */
  if (!isEmpty(events)) {
    const eventIds = events.map(({ _id }) => _id);

    events.forEach(({ _id, schedule, eventDate, ...rest }) => {
      schedule.forEach(({ employeeIds, title }) => {
        if (!isEmpty(employeeIds)) {
          employeeIds.forEach(
            ({
              firstName,
              lastName,
              email,
              emailReminders: sendMemberReminders
            }) => {
              if (sendMemberReminders) {
                const eventDateToString = moment(eventDate)
                  .tz("America/Los_Angeles")
                  .format("MMMM Do, YYYY @ h:mm a");

                emailReminders.push({
                  sendTo: `${firstName} ${lastName} <${email}>`,
                  sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
                  sendDate: createDate().toDate(),
                  subject: `Event Reminder for ${eventDateToString}`,
                  message: eventReminder({
                    callTime: title,
                    eventDate: eventDateToString,
                    ...rest
                  })
                });
              }
            }
          );
        }
      });
    });

    /* istanbul ignore next */
    if (!isEmpty(emailReminders)) {
      await Mail.insertMany(emailReminders);
    }

    await Event.updateMany(
      {
        _id: { $in: eventIds }
      },
      { $set: { sentEmailReminders: true } }
    );
  }

  /* istanbul ignore next */
  console.log(eventLogger(!isEmpty(emailReminders) ? emailReminders : events));
};
