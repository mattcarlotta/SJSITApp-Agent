import isEmpty from "lodash/isEmpty";
import { formLogger } from "loggers";
import { Form, Mail, User } from "models";
import { apFormNotification } from "templates";
import { createDate, endOfDay, startOfDay } from "shared/helpers";

const { CLIENT } = process.env;

export default async () => {
  const startDay = startOfDay();
  const endDay = endOfDay();

  const forms = await Form.find(
    {
      sendEmailNotificationsDate: {
        $gte: startDay,
        $lte: endDay,
      },
      sentEmails: false,
    },
    {
      startMonth: 1,
      endMonth: 1,
      expirationDate: 1,
    },
    { sort: { startMonth: 1 } },
  ).lean();

  /* istanbul ignore next */
  if (!isEmpty(forms)) {
    const members = await User.aggregate([
      { $match: { role: { $ne: "admin" } } },
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

      const formReminders = forms.map(
        ({
          _id, expirationDate, endMonth, startMonth,
        }) => {
          const format = "MM/DD/YYYY";
          const endOfMonth = createDate(endMonth).format(format);
          const startOfMonth = createDate(startMonth).format(format);

          return {
            sendTo: memberEmails,
            sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
            subject: `Sharks & Barracuda A/P Form (${startOfMonth} - ${endOfMonth})`,
            message: apFormNotification({
              _id,
              CLIENT,
              expirationDate: createDate(expirationDate).format(
                "MMMM Do YYYY @ hh:mm a",
              ),
              endMonth: endOfMonth,
              startMonth: startOfMonth,
            }),
          };
        },
      );

      /* istanbul ignore next */
      if (!isEmpty(formReminders)) {
        await Mail.insertMany(formReminders);
        const formIds = forms.map(({ _id }) => _id);
        await Form.updateMany(
          {
            _id: { $in: formIds },
          },
          { $set: { sentEmails: true } },
        );
      }
    }
  }

  console.log(formLogger(forms));
};