import isEmpty from "lodash.isempty";
import mailer from "@sendgrid/mail";
import { scheduleJob } from "node-schedule";
import { connectToDB } from "~database";
import { createDate, getServiceTime } from "~helpers";
import { errorMessage, infoMessage } from "~loggers";
import { Service } from "~models";
import * as services from "services";
import { fullDateTimeFormat, monthnameFormat } from "~utils/dateFormats";
import { IServiceDocument } from "~types";

const { NODE_ENV, SENDGRIDAPIKEY } = process.env;

mailer.setApiKey(SENDGRIDAPIKEY as string);

const pollRate =
  NODE_ENV === "development" ? "*/5 * * * * *" : "*/30 * * * * *";

/**
 * An IFFE to start up automated services.
 */
(async (): Promise<void> => {
  try {
    await connectToDB();
    scheduleJob(pollRate, async () => {
      const currentDate = createDate();

      infoMessage(
        `Polling service was initiated on ${currentDate.format(
          fullDateTimeFormat
        )}.`
      );

      const existingService = (await Service.findOne()
        .limit(1)
        .lean()) as IServiceDocument;

      if (isEmpty(existingService))
        throw String("Services haven't been created yet. Aborted!");

      const {
        automatedOnline,
        emailOnline,
        eventOnline,
        eventDay,
        eventMonth,
        eventTime,
        formReminderOnline,
        formReminderDay,
        formReminderMonth,
        formReminderTime,
        scheduleOnline,
        scheduleDay,
        scheduleMonth,
        scheduleTime
      } = existingService;

      const today = currentDate.toDate();
      const nextMonth = createDate().add(1, "month").format(monthnameFormat);

      if (!automatedOnline) {
        if (
          eventOnline &&
          today > getServiceTime(eventTime, eventDay, eventMonth)
        ) {
          await services.createSharksSchedule();
          await services.createBarracudaSchedule();
          await services.createAPForm();
          await existingService.updateOne({ eventMonth: nextMonth });
        }

        if (
          formReminderOnline &&
          today >
            getServiceTime(formReminderTime, formReminderDay, formReminderMonth)
        ) {
          await services.generateFormReminders();
          await existingService.updateOne({ formReminderMonth: nextMonth });
        }

        if (
          scheduleOnline &&
          today > getServiceTime(scheduleTime, scheduleDay, scheduleMonth)
        ) {
          await services.generateMemberSchedules();
          await services.generateStaffSchedule();
          await existingService.updateOne({ scheduleMonth: nextMonth });
        }
      }

      if (emailOnline) {
        await services.pollForms();
        await services.pollEvents();
        await services.pollEmails();
      }
    });
  } catch (err) {
    errorMessage(err.toString());
  }
})();

process.on("exit", () => infoMessage("Email service has been stopped."));

// catches ctrl+c event
process.on("SIGINT", () =>
  infoMessage("Email service was manully terminated.")
);

// catches uncaught exceptions
process.on("uncaughtException", e =>
  errorMessage(`Email service has been stopped due to an error: ${e.stack}.`)
);
