import mongoose from "mongoose";
import { connectToDB } from "~database";
import { generateMemberSchedules } from "~services";
import { infoMessage } from "~loggers";
import { Event, Mail } from "~models";
import { createDate, getEndOfNextMonth, getStartOfNextMonth } from "~helpers";
import { upcomingSchedule } from "~templates";
import { calendarDateFormat, serviceDateTimeFormat } from "~utils/dateFormats";
import type { TEventMemberSchedule } from "~types";

describe("Generate Employee Schedules Service", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("handles polling schedule events documents", async () => {
    const mailSpy = jest.spyOn(Mail, "insertMany");
    const startMonth = getStartOfNextMonth().format();
    const endMonth = getEndOfNextMonth().format();

    const existingEvent = (await Event.findOne(
      {
        eventDate: {
          $gte: startMonth,
          $lte: endMonth
        }
      },
      {
        callTimes: 1,
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
      .lean()) as TEventMemberSchedule;

    await generateMemberSchedules();

    const events = [
      {
        ...existingEvent,
        email: "Scheduled Member <scheduledmember@test.com>",
        callTime: createDate(existingEvent.callTimes[0]).format("hh:mm a"),
        eventDate: createDate(existingEvent.eventDate).format(
          serviceDateTimeFormat
        )
      }
    ];

    expect(mailSpy).toHaveBeenCalledTimes(1);
    expect(mailSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sendTo: ["Scheduled Member <scheduledmember@test.com>"],
          sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
          subject: `Upcoming Schedule for ${createDate(startMonth).format(
            calendarDateFormat
          )} - ${createDate(endMonth).format(calendarDateFormat)}`,
          message: upcomingSchedule(events)
        })
      ])
    );

    expect(infoMessage).toHaveBeenCalledWith("Processed Member Schedules... 1");
  });
});
