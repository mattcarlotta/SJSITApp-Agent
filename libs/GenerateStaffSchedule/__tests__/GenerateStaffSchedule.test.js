import mongoose from "mongoose";
import { connectToDB } from "~database";
import { generateStaffSchedule } from "~libs";
import { infoMessage } from "~loggers";
import { Event, Mail } from "~models";
import { createDate, getEndOfNextMonth, getStartOfNextMonth } from "~helpers";
import { calendarDateFormat } from "~utils/dateFormats";
import { masterSchedule } from "~templates";

describe("Generate Staff Schedule Service", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("handles polling schedule events documents for staff members", async () => {
    const mailSpy = jest.spyOn(Mail, "insertMany");
    const startMonth = getStartOfNextMonth().toDate();
    const endMonth = getEndOfNextMonth().toDate();

    const existingEvents = await Event.find(
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

    await generateStaffSchedule();

    expect(mailSpy).toHaveBeenCalledTimes(1);
    expect(mailSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sendTo: ["Ice Team Staff <staff@sjsiceteam.com>"],
          sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
          subject: `Upcoming Schedule for ${createDate(startMonth).format(
            calendarDateFormat
          )} - ${createDate(endMonth).format(calendarDateFormat)}`,
          message: masterSchedule(
            existingEvents,
            createDate(startMonth).format(calendarDateFormat),
            createDate(endMonth).format(calendarDateFormat)
          )
        })
      ])
    );

    expect(infoMessage).toHaveBeenCalledWith("Processed Schedules... 1");
  });
});
