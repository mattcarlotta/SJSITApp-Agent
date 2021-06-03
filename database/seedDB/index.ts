import "@noshot/env";
import mongoose from "mongoose";
import { createConnectionToDatabase, connectToDB } from "../index";
import { Event, Form, Mail, Season, User } from "../../models";
import { errorMessage, infoMessage } from "../../loggers";
import {
  createDate,
  getCurrentYear,
  getEndOfNextMonth,
  getMonthDateRange,
  getNextYear,
  getStartOfNextMonth
} from "../../helpers";
import { fullyearFormat } from "../../utils/dateFormats";

const { DATABASE, EXIT, SEED } = process.env;

/**
 * Function to seed the testing Mongo database.
 *
 * @function
 * @returns {string} - displays a:  PASS  utils/seedDB.js message to console.
 * @throws {error} - displays a:  FAIL  utils/seedDB.js message to console with the error.
 */
const seedDB = async (): Promise<any> => {
  try {
    await connectToDB();
    const db = await createConnectionToDatabase();
    await db.dropDatabase();

    const password = "password";
    const registered = createDate().toDate();

    const staff = {
      email: "staffmember@test.com",
      password,
      firstName: "Ice Team",
      lastName: "Staff",
      role: "staff",
      token: "012345678910",
      emailReminders: true,
      registered
    };

    const scheduledMember = {
      avatar: "2.png",
      email: "scheduledmember@test.com",
      password,
      firstName: "Scheduled",
      lastName: "Member",
      role: "member",
      token: "012345678911",
      emailReminders: true,
      registered
    };

    const noUserReminders = {
      email: "bobsmith@example.com",
      password,
      firstName: "Bob",
      lastName: "Smith",
      role: "member",
      token: "012345678912",
      emailReminders: false,
      registered
    };

    await User.insertMany([staff, scheduledMember, noUserReminders]);

    const currentYear = getCurrentYear();
    const nextYear = getNextYear();

    const newSeason = {
      seasonId: `${currentYear.format(fullyearFormat)}${nextYear.format(
        fullyearFormat
      )}`,
      startDate: currentYear.format(),
      endDate: nextYear.format()
    };

    await Season.create(newSeason);

    const scheduledMemberAcct = await User.findOne({
      email: scheduledMember.email
    });
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
          employeeIds: [scheduledMemberAcct!._id]
        }
      ]
    };

    const nextMonthDate = createDate().add(1, "month");

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
          employeeIds: [scheduledMemberAcct!._id]
        }
      ]
    };

    const nextMonthDate1 = createDate().add(1, "month").add(1, "day");

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
          employeeIds: []
        }
      ]
    };

    await Event.insertMany([newEvent, newEvent2, newEvent3]);

    const { startOfMonth, endOfMonth } = getMonthDateRange();

    const newForm = {
      expirationDate: createDate().add(14, "days").toDate(),
      startMonth: startOfMonth.toDate(),
      endMonth: endOfMonth.toDate(),
      sendEmailNotificationsDate: currentTime.format(),
      sentEmails: false,
      notes: "Form 1",
      seasonId: "20192020"
    };

    const newForm2 = {
      expirationDate: createDate().add(14, "days").toDate(),
      startMonth: getStartOfNextMonth().toDate(),
      endMonth: getEndOfNextMonth().toDate(),
      sendEmailNotificationsDate: getStartOfNextMonth().toDate(),
      sentEmails: false,
      notes: "Form 2",
      seasonId: "20192020"
    };

    await Form.insertMany([newForm, newForm2]);

    const newMail1 = {
      sendTo: scheduledMember.email,
      sendDate: currentTime.toDate(),
      sendFrom: "San Jose Sharks Ice Team <testing@sjsiceteam.com>",
      status: "unsent",
      subject: "Testing",
      message: "<p>Testing</p>"
    };

    const newMail2 = {
      sendTo: scheduledMember.email,
      sendDate: currentTime.toDate(),
      sendFrom: "San Jose Sharks Ice Team <testing@sjsiceteam.com>",
      status: "unsent",
      subject: "Testing 2",
      message: "<p>Testing</p>"
    };

    await Mail.insertMany([newMail1, newMail2]);

    await db.close();

    infoMessage(`\x1b[2mutils/\x1b[0m\x1b[1mseedDB.js\x1b[0m (${DATABASE})\n`);

    await mongoose.connection.close();

    if (EXIT) process.exit(0);

    return null;
  } catch (err) {
    errorMessage(`seedDB.js\x1b[0m\x1b[31m\n${err.toString()}\x1b[0m\n`);

    mongoose.connection.close();

    process.exit(0);
  }
};

if (SEED) seedDB();

export default seedDB;
