import chalk from "chalk";
import isEmpty from "lodash/isEmpty";
import { Form, Mail, User } from "models";
import { apFormNotification } from "templates";
import { createDate, endOfDay, startOfDay } from "shared/helpers";

const { CLIENT } = process.env;

const { log } = console;

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

    if (!isEmpty(members)) {
      const memberEmails = members.map(({ email }) => email);

      const formReminders = forms.map(
        ({ _id, expirationDate, endMonth, startMonth }) => {
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

      if (!isEmpty(formReminders)) await Mail.insertMany(formReminders);

      const formIds = forms.map(({ _id }) => _id);
      await Form.updateMany(
        {
          _id: { $in: formIds },
        },
        { $set: { sentEmails: true } },
      );
    }
  }

  log(
    `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.rgb(
      255,
      255,
      255,
    )(`Processed Forms... ${forms.length}`)}`,
  );
};
