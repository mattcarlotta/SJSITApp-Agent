import moment from "moment";
import { connectDatabase } from "database";
import {
  Event, Form, Mail, User,
} from "models";
import {
  createDate,
  getEndOfNextMonth,
  getMonthDateRange,
  getStartOfNextMonth,
} from "shared/helpers";
import { admin, password } from "env";

const { SEED } = process.env;

/**
 * Function to seed the testing Mongo database.
 *
 * @function
 * @async
 * @returns {string} - displays a:  PASS  utils/seedDB.js message to console.
 * @throws {error} - displays a:  FAIL  utils/seedDB.js message to console with the error.
 */

const seedDB = async () => {
  const db = connectDatabase();
  try {
    const administrator = {
      email: admin,
      password,
      firstName: "Matt",
      lastName: "Carlotta",
      role: "employee",
      token: "akqVlA.Zp2lWRQ/bBm3XRbHWW$ejYSZfIT4tZKtfFVIRca7ZZJvKuYhl7B6lijdr",
    };

    await User.create(administrator);

    const adminAccount = await User.findOne({ email: administrator.email });
    const currentTime = createDate();

    const newEvent = {
      team: "San Jose Sharks",
      opponent: "Los Angeles Kings",
      eventType: "Game",
      location: "Test Location",
      callTimes: [currentTime.format()],
      uniform: "Sharks Teal Jersey",
      seasonId: "20192020",
      eventDate: currentTime.format(),
      sentEmailReminders: false,
      notes: "Test notes.",
      schedule: [
        {
          _id: currentTime.format(),
          title: currentTime.format("hh:mm a"),
          employeeIds: [adminAccount._id],
        },
      ],
    };

    const nextMonthDate = moment().add(1, "month");

    const newEvent2 = {
      team: "San Jose Barracuda",
      opponent: "San Diego Gulls",
      eventType: "Game",
      location: "Test Location",
      callTimes: [nextMonthDate.format()],
      uniform: "Barracuda Jacket",
      seasonId: "20192020",
      eventDate: nextMonthDate.format(),
      sentEmailReminders: false,
      notes: "Test notes.",
      schedule: [
        {
          _id: nextMonthDate.format(),
          title: nextMonthDate.format("hh:mm a"),
          employeeIds: [adminAccount._id],
        },
      ],
    };

    const nextMonthDate1 = moment()
      .add(1, "month")
      .add(1, "day");

    const newEvent3 = {
      team: "San Jose Sharks",
      opponent: "Las Vegas Golden Knights",
      eventType: "Game",
      location: "Test Location",
      callTimes: [nextMonthDate1.format()],
      uniform: "Barracuda Jacket",
      seasonId: "20192020",
      eventDate: nextMonthDate1.format(),
      sentEmailReminders: false,
      notes: "Test notes.",
      schedule: [
        {
          _id: nextMonthDate1.format(),
          title: nextMonthDate1.format("hh:mm a"),
          employeeIds: [],
        },
      ],
    };

    await Event.insertMany([newEvent, newEvent2, newEvent3]);

    const { startOfMonth, endOfMonth } = getMonthDateRange();

    const newForm = {
      expirationDate: createDate()
        .add(14, "days")
        .format(),
      startMonth: startOfMonth,
      endMonth: endOfMonth,
      sendEmailNotificationsDate: currentTime.format(),
      sentEmails: false,
      notes: "Form 1",
      seasonId: "20192020",
    };

    const newForm2 = {
      expirationDate: moment()
        .add(1, "month")
        .startOf("month")
        .add(14, "days")
        .endOf("day")
        .format(),
      startMonth: getStartOfNextMonth(),
      endMonth: getEndOfNextMonth(),
      sendEmailNotificationsDate: moment()
        .add(1, "month")
        .startOf("month")
        .format(),
      sentEmails: false,
      notes: "Form 2",
      seasonId: "20192020",
    };

    await Form.insertMany([newForm, newForm2]);

    const newMail1 = {
      sendTo: administrator.email,
      sendDate: currentTime.format(),
      sendFrom: "San Jose Sharks Ice Team <testing@sjsiceteam.com>",
      status: "unsent",
      subject: "Testing",
      message: "<p>Testing</p>",
    };

    const newMail2 = {
      sendTo: administrator.email,
      sendDate: currentTime.format(),
      sendFrom: "San Jose Sharks Ice Team <testing@sjsiceteam.com>",
      status: "unsent",
      subject: "Testing 2",
      message: "<p>Testing</p>",
    };

    await Mail.insertMany([newMail1, newMail2]);

    await db.close();

    return console.log(
      "\n\x1b[7m\x1b[32;1m PASS \x1b[0m \x1b[2mutils/\x1b[0m\x1b[1mseedDB.js",
    );
  } catch (err) {
    return console.log(
      `\n\x1b[7m\x1b[31;1m FAIL \x1b[0m \x1b[2mutils/\x1b[0m\x1b[31;1mseedDB.js\x1b[0m\x1b[31m\n${err.toString()}\x1b[0m`,
    );
  } finally {
    if (SEED) {
      process.exit(0);
    }
  }
};

if (SEED) seedDB();

export default seedDB;
