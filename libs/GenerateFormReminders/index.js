import isEmpty from "lodash.isempty";
import { formLogger } from "~loggers";
import { Form, Mail, User } from "~models";
import { apFormReminder } from "~templates";
import { getEndOfMonth, createDate } from "~helpers";
import moment from "~utils/momentWithTimeZone";

export default async () => {
  const startNextMonth = moment().add(1, "months").startOf("month").format();

  const endNextMonth = getEndOfMonth(startNextMonth);

  const existingForm = await Form.findOne(
    {
      startMonth: { $gte: startNextMonth },
      endMonth: { $lte: endNextMonth }
    },
    {
      startMonth: 1,
      endMonth: 1,
      expirationDate: 1
    },
    { sort: { startMonth: 1 } }
  ).lean();

  const formReminders = [];
  /* istanbul ignore next */
  if (existingForm) {
    const members = await User.aggregate([
      {
        $match: {
          role: { $eq: "employee" },
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
    if (!isEmpty(members)) {
      const memberEmails = members.map(({ email }) => email);
      const { _id, startMonth, endMonth, expirationDate } = existingForm;
      const format = "MM/DD/YYYY";
      const endOfMonth = createDate(endMonth).format(format);
      const startOfMonth = createDate(startMonth).format(format);

      formReminders.push({
        sendTo: memberEmails,
        sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
        subject: `Sharks & Barracuda A/P Form Reminder (${startOfMonth} - ${endOfMonth})`,
        sendDate: createDate().toDate(),
        message: apFormReminder({
          _id,
          expirationDate: createDate(expirationDate)
            .tz("America/Los_Angeles")
            .format("MMMM Do YYYY @ hh:mm a"),
          endMonth: endOfMonth,
          startMonth: startOfMonth
        })
      });

      /* istanbul ignore next */
      if (!isEmpty(formReminders)) await Mail.create(formReminders);
    }
  }

  /* istanbul ignore next */
  console.log(formLogger(formReminders));
};
