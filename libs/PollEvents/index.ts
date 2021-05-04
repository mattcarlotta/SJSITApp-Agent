import isEmpty from "lodash.isempty";
import { infoMessage } from "~loggers";
import { Event, Mail } from "~models";
import { eventReminder } from "~templates";
import { createDate, endOfTomorrow } from "~helpers";
import type { TAggEvents, TEmail } from "~types";

export default async () => {
  const events = (await Event.find(
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
    .lean()) as Array<TAggEvents>;

  const emailReminders = [] as Array<TEmail>;
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
                const eventDateToString = createDate(eventDate).format(
                  "MMMM Do, YYYY @ h:mm a"
                );

                emailReminders.push({
                  sendTo: [`${firstName} ${lastName} <${email}>`],
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
    if (!isEmpty(emailReminders)) await Mail.insertMany(emailReminders);

    await Event.updateMany(
      {
        _id: { $in: eventIds }
      },
      { $set: { sentEmailReminders: true } }
    );
  }

  /* istanbul ignore next */
  infoMessage(`Processed Events... ${!isEmpty(emailReminders) ? emailReminders : events)}`);
};
