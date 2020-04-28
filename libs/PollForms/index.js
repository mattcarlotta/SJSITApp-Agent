import isEmpty from "lodash/isEmpty";
import { formLogger } from "~loggers";
import { Form, Mail, User } from "~models";
import { apFormNotification } from "~templates";
import { createDate, endOfDay } from "~shared/helpers";

const { CLIENT } = process.env;

export default async () => {
  const forms = await Form.find(
    {
      sendEmailNotificationsDate: {
        $lte: endOfDay()
      },
      sentEmails: false
    },
    {
      startMonth: 1,
      endMonth: 1,
      expirationDate: 1,
      notes: 1
    },
    { sort: { startMonth: 1 } }
  ).lean();

  let formReminders = [];
  /* istanbul ignore next */
  if (!isEmpty(forms)) {
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

      formReminders = forms.map(
        ({ _id, expirationDate, endMonth, startMonth, notes }) => {
          const format = "MM/DD/YYYY";
          const endOfMonth = createDate(endMonth).format(format);
          const startOfMonth = createDate(startMonth).format(format);

          return {
            sendTo: memberEmails,
            sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
            subject: `Sharks & Barracuda A/P Form (${startOfMonth} - ${endOfMonth})`,
            sendDate: createDate().toDate(),
            message: apFormNotification({
              _id,
              CLIENT,
              expirationDate: createDate(expirationDate)
                .tz("America/Los_Angeles")
                .format("MMMM Do YYYY @ hh:mm a"),
              endMonth: endOfMonth,
              startMonth: startOfMonth,
              notes
            })
          };
        }
      );

      /* istanbul ignore next */
      if (!isEmpty(formReminders)) await Mail.insertMany(formReminders);
    }

    await Form.updateMany(
      {
        _id: { $in: forms.map(({ _id }) => _id) }
      },
      { $set: { sentEmails: true } }
    );
  }

  /* istanbul ignore next */
  console.log(formLogger(!isEmpty(formReminders) ? formReminders : forms));
};
