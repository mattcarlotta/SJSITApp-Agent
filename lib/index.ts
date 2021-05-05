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

    const nextMonth = getStartOfNextMonth().format(monthnameFormat);

    if (!automatedOnline) {
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
          await existingService.updateOne({ eventMonth: nextMonth });
        } else {
          warnMessage(
            "The Event creation service date hasn't passed yet. Aborted!"
          );
        }
      } else {
        warnMessage("The Event creation service is deactivated. Aborted!");
      }

      if (formReminderOnline) {
        const formReminderServiceDate = createServiceDate(
          formReminderTime,
          formReminderDay,
          formReminderMonth
        );

        if (checkIfDatePassed(formReminderServiceDate)) {
          await services.generateFormReminders();
          await existingService.updateOne({ formReminderMonth: nextMonth });
        } else {
          warnMessage(
            "The AP Form reminders service date hasn't passed yet. Aborted!"
          );
        }
      } else {
        warnMessage("The AP Form reminders service is deactivated. Aborted!");
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
          await existingService.updateOne({ scheduleMonth: nextMonth });
        } else {
          warnMessage(
            "The schedule creation service date hasn't passed yet. Aborted!"
          );
        }
      } else {
        warnMessage("The schedule creation service is deactivated. Aborted!");
      }
    } else {
      warnMessage("All automated services are deactivated. Aborted!");
    }

    if (emailOnline) {
      await services.pollForms();
      await services.pollEvents();
      await services.pollEmails();
    } else {
      warnMessage("Email services are deactivated. Aborted!");
    }
  } catch (err) {
    errorMessage(err.toString());
  }
};

export default RunServices;
