import isEmpty from "lodash.isempty";
import { errorMessage, infoMessage } from "~loggers";
import { Event, Form, Mail } from "~models";
import { upcomingSchedule } from "~templates";
import { createDate, groupByEmail } from "~helpers";
import { calendarDateFormat, serviceDateTimeFormat } from "~utils/dateFormats";
import type { TAggEvents, TEventMemberSchedule, TEventsSorted } from "~types";

/**
 * Generates individual schedules for members.
 *
 * @function GenerateMemberSchedules
 */
const GenerateMemberSchedules = async (): Promise<void> => {
  let sortedSchedules = [] as TEventsSorted;
  const scheduledEvents = [] as Array<TEventMemberSchedule>;
  try {
    const nextMonth = createDate().add(1, "month").startOf("month").toDate();

    // const nextMonth = moment()
    //   .startOf("month")
    //   .toDate();

    const existingForm = await Form.findOne({ startMonth: { $eq: nextMonth } });
    /* istanbul ignore next */
    if (!existingForm) throw String("Unable to locate a form for next month.");

    const startMonth = createDate(existingForm.startMonth);
    const endMonth = createDate(existingForm.endMonth);

    const existingEvents = (await Event.find(
      {
        eventDate: {
          $gte: startMonth.format(),
          $lte: endMonth.format()
        }
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
        select: "_id firstName lastName email"
      })
      .lean()) as Array<TAggEvents>;
    /* istanbul ignore next */
    if (isEmpty(existingEvents))
      throw String("No events were found for next month.");

    existingEvents.forEach(({ schedule, eventDate, ...rest }) => {
      schedule.forEach(({ employeeIds, title: callTime }) => {
        if (!isEmpty(employeeIds)) {
          employeeIds.forEach(({ firstName, lastName, email }) => {
            scheduledEvents.push({
              email: `${firstName} ${lastName} <${email}>`,
              callTime,
              eventDate: createDate(eventDate).format(serviceDateTimeFormat),
              ...rest
            });
          });
        }
      });
    });

    /* istanbul ignore next */
    if (isEmpty(scheduledEvents))
      throw String("No scheduled events were found for next month.");

    sortedSchedules = groupByEmail(scheduledEvents);

    const emails = sortedSchedules.map(({ email, events }) => ({
      sendTo: [email],
      sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
      sendDate: createDate().toDate(),
      subject: `Upcoming Schedule for ${startMonth.format(
        calendarDateFormat
      )} - ${endMonth.format(calendarDateFormat)}`,
      message: upcomingSchedule(events)
    }));

    await Mail.insertMany(emails);

    infoMessage(`Processed Member Schedules... ${sortedSchedules.length}`);
  } catch (err) {
    /* istanbul ignore next */
    errorMessage(err);
  }
};

export default GenerateMemberSchedules;
