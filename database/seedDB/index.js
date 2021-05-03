import chalk from "chalk";
import moment from "moment-timezone";
import { connectDatabase } from "~database";
import { Event, Form, Mail, Season, User } from "~models";
import {
  createDate,
  getCurrentYear,
  getEndOfNextMonth,
  getMonthDateRange,
  getNextYear,
  getStartOfNextMonth
} from "~helpers";
const { DATABASE, SEEDDB } = process.env;

const admin = "carlotta.matt@gmail.com";
const password = "password";

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
    const databaseExists = User.findOne({ email: admin });
    if (databaseExists) await db.dropDatabase();

    const administrator = {
      email: admin,
      password,
      firstName: "Matt",
      lastName: "Carlotta",
      role: "employee",
      token: "akqVlA.Zp2lWRQ/bBm3XRbHWW$ejYSZfIT4tZKtfFVIRca7ZZJvKuYhl7B6lijdr",
      emailReminders: true,
      registered: createDate().toDate()
    };

    const staff = {
      email: "staff@sjsiceteam.com",
      password,
      firstName: "Ice Team",
      lastName: "Staff",
      role: "staff",
      token: "akqVlB.Zp2lWRQ/bBv3XRbHWW$ejYSZfIT4tZKtfFVIRca7ZZJvKuYhl7B6lijdr",
      emailReminders: true,
      registered: createDate().toDate()
    };

    const noUserReminders = {
      email: "bobsmith@example.com",
      password,
      firstName: "Bob",
      lastName: "Smith",
      role: "employee",
      token:
        "akqVlsdfd.Zp2lWRQ/bBm3XRbHWW$ejYSZfIT4tZKtfFVIRca7ZZJvKuYhl7B6lijdr",
      emailReminders: false,
      registered: createDate().toDate()
    };

    await User.insertMany([administrator, staff, noUserReminders]);

    const currentYear = getCurrentYear();
    const nextYear = getNextYear();

    const newSeason = {
      seasonId: `${currentYear.format("YYYY")}${nextYear.format("YYYY")}`,
      startDate: currentYear.format(),
      endDate: nextYear.format()
    };

    await Season.create(newSeason);

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
          employeeIds: [adminAccount._id]
        }
      ]
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
          employeeIds: [adminAccount._id]
        }
      ]
    };

    const nextMonthDate1 = moment().add(1, "month").add(1, "day");

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
          employeeIds: []
        }
      ]
    };

    await Event.insertMany([newEvent, newEvent2, newEvent3]);

    const { startOfMonth, endOfMonth } = getMonthDateRange();

    const newForm = {
      expirationDate: createDate().add(14, "days").format(),
      startMonth: startOfMonth,
      endMonth: endOfMonth,
      sendEmailNotificationsDate: currentTime.format(),
      sentEmails: false,
      notes: "Form 1",
      seasonId: "20192020"
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
      seasonId: "20192020"
    };

    await Form.insertMany([newForm, newForm2]);

    const newMail1 = {
      sendTo: administrator.email,
      sendDate: currentTime.format(),
      sendFrom: "San Jose Sharks Ice Team <testing@sjsiceteam.com>",
      status: "unsent",
      subject: "Testing",
      message: "<p>Testing</p>"
    };

    const newMail2 = {
      sendTo: administrator.email,
      sendDate: currentTime.format(),
      sendFrom: "San Jose Sharks Ice Team <testing@sjsiceteam.com>",
      status: "unsent",
      subject: "Testing 2",
      message: "<p>Testing</p>"
    };

    await Mail.insertMany([newMail1, newMail2]);

    await db.close();

    console.log(
      `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" SEED ")} ${chalk.blue(
        `\x1b[2mutils/\x1b[0m\x1b[1mseedDB.js\x1b[0m (${DATABASE})`
      )}\n`
    );

    return SEEDDB ? process.exit(0) : true;
  } catch (err) {
    console.log(
      `\n\x1b[7m\x1b[31;1m FAIL \x1b[0m \x1b[2mutils/\x1b[0m\x1b[31;1mseedDB.js\x1b[0m\x1b[31m\n${err.toString()}\x1b[0m`
    );

    return SEEDDB ? process.exit(1) : false;
  }
};

if (SEEDDB) seedDB();

export default seedDB;