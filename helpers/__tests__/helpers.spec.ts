import {
  createDate,
  createSchedule,
  getCurrentYear,
  getMonthDateRange,
  getNextYear,
  getServiceTime,
  getStartOfMonth,
  groupByEmail
} from "~helpers";
import moment from "~utils/momentWithTimeZone";
import type { TEventMemberSchedule } from "~types";
import { fullyearFormat } from "~utils/dateFormats";

const scheduledEvents = [
  {
    email: "Matt Carlotta <carlotta.matt@gmail.com>",
    callTime: "08:00 pm",
    eventDate: "November 17th 2019, 8:00 pm",
    eventType: "Game",
    location: "Test Location",
    uniform: "Barracuda Jacket",
    team: "San Jose Barracuda",
    opponent: "San Diego Gulls",
    notes: "Test notes."
  },
  {
    email: "Matt Carlotta <carlotta.matt@gmail.com>",
    callTime: "07:00 pm",
    eventDate: "November 18th 2019, 7:30 pm",
    eventType: "Game",
    location: "Test Location",
    uniform: "Sharks Teal Jersey",
    team: "San Jose Sharks",
    opponent: "Anaheim Ducks",
    notes: ""
  }
] as Array<TEventMemberSchedule>;

describe("Helper Functions", () => {
  it("returns a current date or specified date", () => {
    const format = "MMMM Do YYYY";
    const selectedDate = createDate("2019-10-08T03:30:15.000+00:00").format(
      format
    );
    const todaysDate = moment(Date.now()).format(format);
    const currentDate = createDate().format(format);

    expect(selectedDate).toEqual("October 7th 2019");
    expect(currentDate).toEqual(todaysDate);
  });

  it("returns a structured array with callTimes for scheduling", () => {
    const schedule = createSchedule([moment().format()]);

    expect(schedule).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          employeeIds: expect.any(Array)
        })
      ])
    );
  });

  it("returns a current year Date", () => {
    const currentYear = getCurrentYear().format(fullyearFormat);

    expect(currentYear).toEqual(expect.any(String));
  });

  it("returns the start of the month", () => {
    const startMonth = getStartOfMonth().format();

    expect(startMonth).toEqual(moment().startOf("month").format());
  });

  it("returns a current month range or specified month range", () => {
    const selectedDate = "2019-09-08T03:30:15.000+00:00";

    const {
      startOfMonth: selectedStartMonth,
      endOfMonth: selectedEndMonth
    } = getMonthDateRange(selectedDate);

    expect(selectedStartMonth.toDate()).toEqual(
      moment("2019-09-01T07:00:00.000Z").toDate()
    );
    expect(selectedEndMonth.toDate()).toEqual(
      moment("2019-10-01T06:59:59.999Z").toDate()
    );

    const currentDate = Date.now();
    const {
      startOfMonth: currentStartMonth,
      endOfMonth: currentEndMonth
    } = getMonthDateRange();

    expect(currentStartMonth.toDate()).toEqual(
      moment(currentDate).startOf("month").toDate()
    );
    expect(currentEndMonth.toDate()).toEqual(
      moment(currentDate).endOf("month").toDate()
    );
  });

  it("returns a next year Date", () => {
    const nextYear = getNextYear().format(fullyearFormat);

    expect(nextYear).toEqual(expect.any(String));
  });

  it("returns a date with current day, month and year", () => {
    const serviceDate = getServiceTime("12:00 pm", "1st", "January");

    expect(serviceDate).toEqual(expect.any(Date));
  });

  it("groups all objects by email", () => {
    const groupedData = groupByEmail(scheduledEvents);
    expect(groupedData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: expect.any(String),
          events: expect.arrayContaining([
            expect.objectContaining({
              callTime: expect.any(String),
              eventDate: expect.any(String),
              eventType: expect.any(String),
              location: expect.any(String),
              uniform: expect.any(String),
              team: expect.any(String),
              opponent: expect.any(String),
              notes: expect.any(String)
            })
          ])
        })
      ])
    );
  });
});
