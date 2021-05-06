import mongoose from "mongoose";
import { connectToDB } from "~database";
import { pollEvents } from "~services";
import { infoMessage } from "~loggers";
import { Event, Mail } from "~models";
import { createDate, endOfTomorrow } from "~helpers";
import { eventReminder } from "~templates";
import { serviceDateTimeFormat } from "~utils/dateFormats";
import type { IEventDocument, TAggEvents } from "~types";

describe("Poll Events Service", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("handles polling Events documents", async () => {
    const mailSpy = jest.spyOn(Mail, "insertMany");
    const endDay = endOfTomorrow();

    const events = (await Event.find(
      {
        eventDate: {
          $lte: endDay
        },
        sentEmailReminders: false
      },
      {
        eventDate: 1,
        eventType: 1,
        location: 1,
        notes: 1,
        opponent: 1,
        schedule: 1,
        team: 1,
        uniform: 1
      },
      { sort: { eventDate: 1 } }
    )
      .populate({
        path: "schedule.employeeIds",
        select: "_id firstName lastName email"
      })
      .lean()) as Array<TAggEvents>;

    await pollEvents();

    const { _id, eventDate, schedule, ...rest } = events[0];
    const { _id: callTime } = schedule[0];
    const { firstName, lastName, email } = schedule[0].employeeIds[0];
    const eventDateToString = createDate(eventDate).format(
      serviceDateTimeFormat
    );

    expect(mailSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sendTo: [`${firstName} ${lastName} <${email}>`],
          sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
          subject: `Event Reminder for ${eventDateToString}`,
          message: eventReminder({
            callTime,
            eventDate: eventDateToString,
            ...rest
          })
        })
      ])
    );

    const updatedEvent = (await Event.findOne({ _id })) as IEventDocument;
    expect(updatedEvent.sentEmailReminders).toBeTruthy();

    expect(infoMessage).toHaveBeenCalledTimes(1);
  });
});
