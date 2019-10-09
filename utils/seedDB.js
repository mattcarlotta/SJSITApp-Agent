import { connectDatabase } from "database";
import {
  Event, Form, Mail, User,
} from "models";
import { createDate, getMonthDateRange } from "shared/helpers";
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
      uniform: "Teal Jersey",
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

    await Event.create(newEvent);

    const { startOfMonth, endOfMonth } = getMonthDateRange();

    const newForm = {
      expirationDate: createDate()
        .add(7, "days")
        .format(),
      startMonth: startOfMonth,
      endMonth: endOfMonth,
      sendEmailNotificationsDate: currentTime.format(),
      sentEmails: false,
      notes: "Form 1",
      seasonId: "20192020",
    };

    await Form.create(newForm);

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
