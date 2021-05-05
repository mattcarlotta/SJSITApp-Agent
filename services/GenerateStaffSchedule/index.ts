import isEmpty from "lodash.isempty";
import { errorMessage, infoMessage } from "~loggers";
import { Event, Form, Mail, User } from "~models";
import { masterSchedule } from "~templates";
import { createDate } from "~helpers";
import { calendarDateFormat } from "~utils/dateFormats";
import type { TAggEvents, TEmail } from "~types";

/**
 * Generates individual schedules for staff.
 *
 * @function GenerateStaffSchedule
 */
const GenerateStaffSchedule = async (): Promise<void> => {
  const masterScheduleMail = [] as Array<TEmail>;
  try {
    const nextMonth = createDate().add(1, "months").startOf("month").toDate();

    // const nextMonth = moment()
    //   .startOf("month")
    //   .toDate();

    const existingForm = await Form.findOne({ startMonth: { $eq: nextMonth } });
    /* istanbul ignore next */
    if (!existingForm) throw String("Unable to locate a form for next month.");

    const startMonth = createDate(existingForm.startMonth);
    const endMonth = createDate(existingForm.endMonth);

    const events = (await Event.find(
      {
        eventDate: {
          $gte: startMonth.format(),
          $lte: endMonth.format()
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
      .lean()) as Array<TAggEvents>;
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
    const scheduleStartMonth = startMonth.format(calendarDateFormat);
    const scheduleEndMonth = endMonth.format(calendarDateFormat);

    masterScheduleMail.push({
      sendTo: staffEmailAddresses,
      sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
      sendDate: createDate().toDate(),
      subject: `Upcoming Schedule for ${scheduleStartMonth} - ${scheduleEndMonth}`,
      message: masterSchedule(events, scheduleStartMonth, scheduleEndMonth)
    });

    await Mail.insertMany(masterScheduleMail);

    infoMessage(`Processed Schedules... ${masterScheduleMail.length}`);
  } catch (err) {
    /* istanbul ignore next */
    errorMessage(err);
  }
};

export default GenerateStaffSchedule;
