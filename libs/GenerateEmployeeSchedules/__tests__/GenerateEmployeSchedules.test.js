import mongoose from "mongoose";
import { connectToDB } from "~database";
import { generateEmployeeSchedules } from "~libs";
import { infoMessage } from "~loggers";
import { Event, Mail } from "~models";
import { createDate, getEndOfNextMonth, getStartOfNextMonth } from "~helpers";
import { upcomingSchedule } from "~templates";
import { calendarDateFormat } from "~utils/dateFormats";

describe("Generate Employee Schedules Service", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("handles polling schedule events documents", async () => {
    const mailSpy = jest.spyOn(Mail, "insertMany");
    const startMonth = getStartOfNextMonth().toDate();
    const endMonth = getEndOfNextMonth().toDate();

    const existingEvent = await Event.findOne(
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
      .lean();

    await generateEmployeeSchedules();

    const events = [
      {
        ...existingEvent,
        email: "Matt Carlotta <carlotta.matt@gmail.com>",
        callTime: createDate(existingEvent.callTimes[0]).format("hh:mm a"),
        eventDate: createDate(existingEvent.eventDate).format(
          "MMMM Do YYYY, h:mm a"
        )
      }
    ];

    expect(mailSpy).toHaveBeenCalledTimes(1);
    expect(mailSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sendTo: ["Matt Carlotta <carlotta.matt@gmail.com>"],
          sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
          subject: `Upcoming Schedule for ${createDate(startMonth).format(
            calendarDateFormat
          )} - ${createDate(endMonth).format(calendarDateFormat)}`,
          message: upcomingSchedule(events)
        })
      ])
    );

    expect(console.log).toHaveBeenCalledWith(
      infoMessage("Processed Schedules... 1")
    );
  });
});
