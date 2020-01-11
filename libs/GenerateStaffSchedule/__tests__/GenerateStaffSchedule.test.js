import moment from "moment-timezone";
import { generateStaffSchedule } from "libs";
import { scheduleLogger } from "loggers";
import { Event, Mail } from "models";
import { getEndOfNextMonth, getStartOfNextMonth } from "shared/helpers";
import { masterSchedule } from "templates";

describe("Generate Staff Schedule Service", () => {
  let db;
  beforeAll(() => {
    db = connectDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  it("handles polling schedule events documents for staff members", async () => {
    const mailSpy = jest.spyOn(Mail, "insertMany");
    const startMonth = getStartOfNextMonth();
    const endMonth = getEndOfNextMonth();

    const existingEvents = await Event.find(
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

    await generateStaffSchedule();

    const format = "MM/DD/YYYY";
    expect(mailSpy).toHaveBeenCalledTimes(1);
    expect(mailSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sendTo: ["Ice Team Staff <staff@sjsiceteam.com>"],
          sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
          subject: `Upcoming Schedule for ${moment(startMonth).format(
            format,
          )} - ${moment(endMonth).format(format)}`,
          message: masterSchedule(
            existingEvents,
            moment(startMonth).format(format),
            moment(endMonth).format(format),
          ),
        }),
      ]),
    );

    expect(console.log).toHaveBeenCalledWith(scheduleLogger([1]));
  });
});
