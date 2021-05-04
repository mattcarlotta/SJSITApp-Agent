import isEmpty from "lodash.isempty";
import { errorLogger, scheduleLogger } from "~loggers";
import { Event, Form, Mail } from "~models";
import { upcomingSchedule } from "~templates";
import { createDate, groupByEmail } from "~helpers";
import moment from "~utils/momentWithTimeZone";
import { calendarDateFormat } from "~utils/dateFormats";
import type { TAggEvents, TEventMemberSchedule, TEventsSorted } from "~types";

export default async () => {
  let sortedSchedules = [] as TEventsSorted;
  const scheduledEvents = [] as Array<TEventMemberSchedule>;
  try {
    const nextMonth = moment().add(1, "month").startOf("month").toDate();

    // const nextMonth = moment()
    //   .startOf("month")
    //   .toDate();

    const existingForm = await Form.findOne({ startMonth: { $eq: nextMonth } });
    /* istanbul ignore next */
    if (!existingForm) throw String("Unable to locate a form for next month.");

    const startMonth = moment(existingForm.startMonth);
    const endMonth = moment(existingForm.endMonth);

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

    existingEvents.forEach(({ _id, schedule, eventDate, ...rest }) => {
      schedule.forEach(({ employeeIds, title: callTime }) => {
        if (!isEmpty(employeeIds)) {
          employeeIds.forEach(({ firstName, lastName, email }) => {
            scheduledEvents.push({
              email: `${firstName} ${lastName} <${email}>`,
              callTime,
              eventDate: moment(eventDate).format("MMMM Do YYYY, h:mm a"),
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
  } catch (err) {
    /* istanbul ignore next */
    console.log(errorLogger(err));
  } finally {
    console.log(scheduleLogger(sortedSchedules));
  }
};
