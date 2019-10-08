import chalk from "chalk";
import mailer from "@sendgrid/mail";
import isEmpty from "lodash/isEmpty";
import { Mail } from "models";
import { officialTemplate } from "templates";
import { endOfDay, startOfDay } from "shared/helpers";

const { log } = console;

export default async () => {
  const startDay = startOfDay();
  const endDay = endOfDay();

  const emails = await Mail.aggregate([
    {
      $match: {
        sendDate: {
          $gte: startDay,
          $lte: endDay,
        },
        status: "unsent",
      },
    },
    { $sort: { sendDate: -1 } },
  ]);

  if (!isEmpty(emails)) {
    for (let i = 0; i < emails.length; i++) {
      const existingMail = emails[i];
      const { _id, message, sendFrom, sendTo, subject } = existingMail;

      await mailer
        .send({
          to: sendTo,
          from: sendFrom,
          subject,
          html: officialTemplate(message),
        })
        .then(async () => {
          await Mail.updateOne({ _id }, { status: "sent" });
        })
        .catch(async error => {
          await Mail.updateOne(
            { _id },
            { status: `failed - ${error.message}` },
          );
        });
    }
  }

  log(
    `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.rgb(
      255,
      255,
      255,
    )(`Processed Mail... ${emails.length}`)}\n`,
  );
};
