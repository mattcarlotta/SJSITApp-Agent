import isEmpty from "lodash/isEmpty";
import { infoMessage } from "~loggers";
import { Form, Mail, User } from "~models";
import { apFormNotification } from "~templates";
import { createDate, endOfDay } from "~helpers";
import { dateTimeFormat, calendarDateFormat } from "~utils/dateFormats";
import type { TEmail } from "~types";

/**
 * Polls Forms documents to create form reminders.
 *
 * @function PollForms
 */
const PollForms = async (): Promise<void> => {
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

  let formReminders = [] as Array<TEmail>;
  /* istanbul ignore next */
  if (!isEmpty(forms)) {
    const members = await User.aggregate([
      {
        $match: {
          role: { $eq: "member" },
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
          const endOfMonth = createDate(endMonth).format(calendarDateFormat);
          const startOfMonth = createDate(startMonth).format(
            calendarDateFormat
          );

          return {
            sendTo: memberEmails,
            sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
            subject: `Sharks & Barracuda A/P Form (${startOfMonth} - ${endOfMonth})`,
            sendDate: createDate().toDate(),
            message: apFormNotification({
              _id,
              expirationDate: createDate(expirationDate).format(dateTimeFormat),
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

  infoMessage(`Processed Forms... ${formReminders.length}`);
};

export default PollForms;
