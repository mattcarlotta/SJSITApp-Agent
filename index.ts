import isEmpty from "lodash.isempty";
import { scheduleJob } from "node-schedule";
import { connectToDB } from "~database";
import { createDate, getServiceTime } from "~helpers";
import {
  createAPForm,
  createBarracudaSchedule,
  createSharksSchedule,
  generateEmployeeSchedules,
  generateFormReminders,
  generateStaffSchedule,
  pollEmails,
  pollEvents,
  pollForms
} from "~libs";
import { errorMessage, infoMessage } from "~loggers";
import { Service } from "~models";
import "~middlewares";
import { fullDateTimeFormat, monthnameFormat } from "~utils/dateFormats";
import { IServiceDocument } from "~types";

//= ===========================================================//
// CREATE POLLING SERVICES                                     //
//= ===========================================================//

const pollRate =
  process.env.NODE_ENV === "development" ? "*/5 * * * * *" : "*/30 * * * * *";

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
          await createSharksSchedule();
          await createBarracudaSchedule();
          await createAPForm();
          await existingService.updateOne({ eventMonth: nextMonth });
        }

        if (
          formReminderOnline &&
          today >
            getServiceTime(formReminderTime, formReminderDay, formReminderMonth)
        ) {
          await generateFormReminders();
          await existingService.updateOne({ formReminderMonth: nextMonth });
        }

        if (
          scheduleOnline &&
          today > getServiceTime(scheduleTime, scheduleDay, scheduleMonth)
        ) {
          await generateEmployeeSchedules();
          await generateStaffSchedule();
          await existingService.updateOne({ scheduleMonth: nextMonth });
        }
      }

      if (emailOnline) {
        await pollForms();
        await pollEvents();
        await pollEmails();
      }
    });
  } catch (err) {
    errorMessage(err.toString());
  }
})();

/*
 //= ===========================================================//
  SCHEDULES                                                   
  //= ===========================================================//

  send out individual schedules to employees on the 15th of every month @ 6pm
  scheduleJob("0 18 15 * *", () => generateEmployeeSchedules());

  send out a master schedule to the staff on the 15th of every month @ 7pm
  scheduleJob("0 19 15 * *", () => generateStaffSchedule());

  //= ===========================================================//
   EVENTS & AP FORMS                                           
  //= ===========================================================//

  send out A/P form reminders to employees on the 5th of every month @ 6pm
  scheduleJob("0 18 5 * *", () => generateFormReminders());

  retrieve next month's events from API and generate next months A/P form
  on the 16th of every month @ 7:59am
  scheduleJob("59 7 16 * *", () => createSharksSchedule());
*/
