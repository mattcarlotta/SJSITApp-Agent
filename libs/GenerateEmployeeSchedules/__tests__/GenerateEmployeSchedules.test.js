import moment from "moment-timezone";
import { generateEmployeeSchedules } from "libs";
import { scheduleLogger } from "loggers";
import { Event, Mail } from "models";
import { getEndOfNextMonth, getStartOfNextMonth } from "shared/helpers";
import { upcomingSchedule } from "templates";

describe("Generate Employee Schedules Service", () => {
  let db;
  beforeAll(() => {
    db = connectDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  it("handles polling schedule events documents", async () => {
    const mailSpy = jest.spyOn(Mail, "insertMany");
    const startMonth = getStartOfNextMonth();
    const endMonth = getEndOfNextMonth();

    const existingEvent = await Event.findOne(
      {
        eventDate: {
          $gte: startMonth,
          $lte: endMonth,
        },
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
        uniform: 1,
      },
      { sort: { eventDate: 1 } },
    )
      .populate({
        path: "schedule.employeeIds",
        select: "_id firstName lastName email",
      })
      .lean();

    await generateEmployeeSchedules();

    const events = [
      {
        ...existingEvent,
        email: "Matt Carlotta <carlotta.matt@gmail.com>",
        callTime: moment(existingEvent.callTimes[0]).format("hh:mm a"),
        eventDate: moment(existingEvent.eventDate).format(
          "MMMM Do YYYY, h:mm a",
        ),
      },
    ];

    expect(mailSpy).toHaveBeenCalledTimes(1);
    expect(mailSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sendTo: ["Matt Carlotta <carlotta.matt@gmail.com>"],
          sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
          subject: `Upcoming Schedule for ${moment(startMonth).format(
            "MM/DD/YYYY",
          )} - ${moment(endMonth).format("MM/DD/YYYY")}`,
          message: upcomingSchedule({
            events,
          }),
        }),
      ]),
    );

    expect(console.log).toHaveBeenCalledWith(scheduleLogger([1]));
  });
});
