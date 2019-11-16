import moment from "moment-timezone";
import { pollEvents } from "libs";
import { eventLogger } from "loggers";
import { Event, Mail } from "models";
import { endOfTomorrow } from "shared/helpers";
import { eventReminder } from "templates";

describe("Poll Events Service", () => {
  let db;
  beforeAll(() => {
    db = connectDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  it("handles polling Events documents", async () => {
    const mailSpy = jest.spyOn(Mail, "insertMany");
    const endDay = endOfTomorrow();

    const events = await Event.find(
      {
        eventDate: {
          $lte: endDay,
        },
        sentEmailReminders: false,
      },
      {
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

    await pollEvents();

    const {
      _id, eventDate, schedule, ...rest
    } = events[0];
    const { title } = schedule[0];
    const { firstName, lastName, email } = schedule[0].employeeIds[0];
    const eventDateToString = moment(eventDate).format(
      "MMMM Do, YYYY @ h:mm a",
    );

    expect(mailSpy).toHaveBeenCalledTimes(1);
    expect(mailSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sendTo: `${firstName} ${lastName} <${email}>`,
          sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
          subject: `Event Reminder for ${eventDateToString}`,
          message: eventReminder({
            callTime: title,
            eventDate: eventDateToString,
            ...rest,
          }),
        }),
      ]),
    );

    const updatedEvent = await Event.findOne({ _id });
    expect(updatedEvent.sentEmailReminders).toBeTruthy();

    expect(console.log).toHaveBeenCalledWith(eventLogger([1]));
  });
});
