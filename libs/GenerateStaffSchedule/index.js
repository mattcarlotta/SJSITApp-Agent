import isEmpty from "lodash.isempty";
import { errorLogger, scheduleLogger } from "~loggers";
import { Event, Form, Mail, User } from "~models";
import { masterSchedule } from "~templates";
import { createDate } from "~helpers";
import moment from "~utils/momentWithTimeZone";

export default async () => {
  const masterScheduleMail = [];
  try {
    const nextMonth = moment().add(1, "months").startOf("month").format();

    // const nextMonth = moment()
    //   .startOf("month")
    //   .toDate();

    const existingForm = await Form.findOne({ startMonth: { $eq: nextMonth } });
    /* istanbul ignore next */
    if (!existingForm) throw String("Unable to locate a form for next month.");

    const events = await Event.find(
      {
        eventDate: {
          $gte: existingForm.startMonth,
          $lte: existingForm.endMonth
        }
      },
      {
        eventType: 1,
        eventDate: 1,
        location: 1,
        notes: 1,
        opponent: 1,
        team: 1,
        uniform: 1,
        schedule: 1
      },
      { sort: { eventDate: 1 } }
    )
      .populate({
        path: "schedule.employeeIds",
        select: "_id firstName lastName"
      })
      .lean();
    /* istanbul ignore next */
    if (isEmpty(events)) throw String("No events were found for next month.");

    const staffMembers = await User.aggregate([
      {
        $match: {
          role: { $eq: "staff" },
          status: "active",
          emailReminders: true
        }
      },
      { $sort: { lastName: 1 } },
      {
        $project: {
          id: 1,
          email: {
            $concat: ["$firstName", " ", "$lastName", " ", "<", "$email", ">"]
          }
        }
      }
    ]);
    /* istanbul ignore next */
    if (isEmpty(staffMembers))
      throw String("Unable to locate any staff members.");

    const staffEmailAddresses = staffMembers.map(({ email }) => email);
    const format = "MM/DD/YYYY";
    const startMonth = moment(existingForm.startMonth).format(format);
    const endMonth = moment(existingForm.endMonth).format(format);

    masterScheduleMail.push({
      sendTo: staffEmailAddresses,
      sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
      sendDate: createDate().toDate(),
      subject: `Upcoming Schedule for ${startMonth} - ${endMonth}`,
      message: masterSchedule(events, startMonth, endMonth)
    });

    await Mail.insertMany(masterScheduleMail);
  } catch (err) {
    /* istanbul ignore next */
    console.log(errorLogger(err));
  } finally {
    console.log(scheduleLogger(masterScheduleMail));
  }
};
