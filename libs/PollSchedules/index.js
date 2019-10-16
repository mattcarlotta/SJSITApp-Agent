import moment from "moment";
import isEmpty from "lodash/isEmpty";
import { scheduleLogger } from "loggers";
import { Event, Form, Mail } from "models";
import { upcomingSchedule } from "templates";
import { groupByEmail } from "shared/helpers";

export default async () => {
  let sortedSchedules = [];
  const nextMonth = moment().add(1, "months");
  // const nextMonth = moment()
  //   .startOf("month")
  //   .toDate();

  const existingForm = await Form.findOne({
    startMonth: nextMonth,
  });

  if (existingForm) {
    const existingEvents = await Event.find(
      {
        eventDate: {
          $gte: existingForm.startMonth,
          $lte: existingForm.endMonth,
        },
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

    const scheduledEvents = [];
    /* istanbul ignore next */
    if (!isEmpty(existingEvents)) {
      existingEvents.forEach(({
        _id, schedule, eventDate, ...rest
      }) => {
        schedule.forEach(({ employeeIds, title: callTime }) => {
          if (!isEmpty(employeeIds)) {
            employeeIds.forEach(({ firstName, lastName, email }) => {
              scheduledEvents.push({
                email: `${firstName} ${lastName} <${email}>`,
                callTime,
                eventDate: moment(eventDate).format("MMMM Do YYYY, h:mm a"),
                ...rest,
              });
            });
          }
        });
      });

      if (!isEmpty(scheduledEvents)) {
        sortedSchedules = groupByEmail(scheduledEvents);

        const emails = sortedSchedules.map(({ email, events }) => ({
          sendTo: [email],
          sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
          subject: `Upcoming Schedule for ${moment(
            existingForm.startMonth,
          ).format("MM/DD/YYYY")} - ${moment(existingForm.endMonth).format(
            "MM/DD/YYYY",
          )}`,
          message: upcomingSchedule({
            events,
          }),
        }));

        await Mail.insertMany(emails);
      }
    }
  }

  console.log(scheduleLogger(sortedSchedules));
};
