import isEmpty from "lodash/isEmpty";
import { formLogger } from "loggers";
import { Form, Mail, User } from "models";
import { apFormReminder } from "templates";
import { getEndOfMonth, getStartOfMonth, createDate } from "shared/helpers";

const { CLIENT } = process.env;

export default async () => {
  const existingForm = await Form.findOne(
    {
      startMonth: { $gte: getStartOfMonth() },
      endMonth: { $lte: getEndOfMonth() },
    },
    {
      startMonth: 1,
      endMonth: 1,
      expirationDate: 1,
    },
    { sort: { startMonth: 1 } },
  ).lean();

  const formReminders = [];
  /* istanbul ignore next */
  if (existingForm) {
    const members = await User.aggregate([
      {
        $match: {
          role: { $eq: "employee" },
          status: "active",
          emailReminders: true,
        },
      },
      { $sort: { lastName: 1 } },
      {
        $project: {
          id: 1,
          email: {
            $concat: ["$firstName", " ", "$lastName", " ", "<", "$email", ">"],
          },
        },
      },
    ]);

    /* istanbul ignore next */
    if (!isEmpty(members)) {
      const memberEmails = members.map(({ email }) => email);
      const {
        _id, startMonth, endMonth, expirationDate,
      } = existingForm;
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
          CLIENT,
          expirationDate: createDate(expirationDate)
            .tz("America/Los_Angeles")
            .format("MMMM Do YYYY @ hh:mm a"),
          endMonth: endOfMonth,
          startMonth: startOfMonth,
        }),
      });

      /* istanbul ignore next */
      if (!isEmpty(formReminders)) await Mail.create(formReminders);
    }
  }

  /* istanbul ignore next */
  console.log(formLogger(formReminders));
};
