import isEmpty from "lodash.isempty";
import {
  checkIfDatePassed,
  createDate,
  createServiceDate,
  getStartOfNextMonth
} from "~helpers";
import { errorMessage, infoMessage, warnMessage } from "~loggers";
import { Service } from "~models";
import * as services from "~services";
import { fullDateTimeFormat, monthnameFormat } from "~utils/dateFormats";
import { IServiceDocument } from "~types";

/**
 * Runs all services.
 *
 * @function RunServices
 */
const RunServices = async (): Promise<void> => {
  try {
    infoMessage(
      `Polling service was initiated on ${createDate().format(
        fullDateTimeFormat
      )}.`
    );

    const existingService = (await Service.findOne()
      .limit(1)
      .lean()) as IServiceDocument;

    if (isEmpty(existingService))
      throw String("The services haven't been created yet.");

    const {
      _id,
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

    const nextMonth = getStartOfNextMonth().format(monthnameFormat);

    if (automatedOnline) {
      const eventServiceDate = createServiceDate(
        eventTime,
        eventDay,
        eventMonth
      );

      if (eventOnline) {
        if (checkIfDatePassed(eventServiceDate)) {
          await services.createSharksSchedule();
          await services.createBarracudaSchedule();
          await services.createAPForm();
          await Service.updateOne({
            _id,
            eventMonth: nextMonth
          });
        } else {
          warnMessage("The event creation service date hasn't passed yet.");
        }
      } else {
        warnMessage("The event creation service is deactivated.");
      }

      if (formReminderOnline) {
        const formReminderServiceDate = createServiceDate(
          formReminderTime,
          formReminderDay,
          formReminderMonth
        );

        if (checkIfDatePassed(formReminderServiceDate)) {
          await services.generateFormReminders();
          await Service.updateOne({
            _id,
            formReminderMonth: nextMonth
          });
        } else {
          warnMessage("The AP form reminders service date hasn't passed yet.");
        }
      } else {
        warnMessage("The AP form reminders service is deactivated.");
      }

      if (scheduleOnline) {
        const scheduleServiceDate = createServiceDate(
          scheduleTime,
          scheduleDay,
          scheduleMonth
        );

        if (checkIfDatePassed(scheduleServiceDate)) {
          await services.generateMemberSchedules();
          await services.generateStaffSchedule();
          await Service.updateOne({
            _id,
            scheduleMonth: nextMonth
          });
        } else {
          warnMessage("The schedule creation service date hasn't passed yet.");
        }
      } else {
        warnMessage("The schedule creation service is deactivated.");
      }
    } else {
      warnMessage("All automated services are deactivated.");
    }

    if (emailOnline) {
      await services.pollForms();
      await services.pollEvents();
      await services.pollEmails();
    } else {
      warnMessage("Email services are deactivated.");
    }
  } catch (err) {
    errorMessage(err.toString());
  }
};

/* istanbul ignore next */
process.on("exit", () => infoMessage("Email service has been stopped."));

// catches ctrl+c event
/* istanbul ignore next */
process.on("SIGINT", () =>
  infoMessage("Email service was manully terminated.")
);

// catches uncaught exceptions
/* istanbul ignore next */
process.on("uncaughtException", e =>
  errorMessage(`Email service has been stopped due to an error: ${e.stack}.`)
);

export default RunServices;
