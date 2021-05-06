import isEmpty from "lodash.isempty";
import { infoMessage } from "~loggers";
import { Event, Mail } from "~models";
import { eventReminder } from "~templates";
import { createDate, endOfTomorrow } from "~helpers";
import { serviceDateTimeFormat } from "~utils/dateFormats";
import type { TAggEvents, TEmail } from "~types";

/**
 * Polls Events documents to create email reminders.
 *
 * @function PollEvents
 */
const PollEvents = async (): Promise<void> => {
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

    events.forEach(({ schedule, eventDate, ...rest }) => {
      schedule.forEach(({ employeeIds, _id: callTime }) => {
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
                  serviceDateTimeFormat
                );

                emailReminders.push({
                  sendTo: [`${firstName} ${lastName} <${email}>`],
                  sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
                  sendDate: createDate().toDate(),
                  subject: `Event Reminder for ${eventDateToString}`,
                  message: eventReminder({
                    callTime,
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
  infoMessage(`Processed Events... ${emailReminders.length}`);
};

export default PollEvents;
