/* eslint-disable no-console */
import { connectDatabase } from "database";
import {
  Event, Form, User, Season, Team, Token,
} from "models";
import {
  createSchedule,
  createSignupToken,
  createRandomToken,
  expirationDate,
} from "shared/helpers";
import config from "env";

const { NODE_ENV, SEED } = process.env;

const { admin, password } = config[NODE_ENV];

/**
 * Function to seed the testing Mongo database.
 *
 * @function
 * @async
 * @returns {string} - displays a:  PASS  utils/seedDB.js message to console.
 * @throws {error} - displays a:  FAIL  utils/seedDB.js message to console with the error.
 */

const teams = [
  { team: "Anaheim Ducks", league: "NHL", name: "anaheim-ducks" },
  { team: "Arizona Coyotes", league: "NHL", name: "arizona-coyotes" },
  { team: "Bakersfield Condors", league: "AHL", name: "bakersfield-condors" },
  { team: "Belleville Senators", league: "AHL", name: "belleville-senators" },
  { team: "Binghamton Devils", league: "AHL", name: "binghamton-devils" },
  { team: "Boston Bruins", league: "NHL", name: "boston-bruins" },
  {
    team: "Bridgeport Sound Tigers",
    league: "AHL",
    name: "bridgeport-sound-tigers",
  },
  { team: "Buffalo Sabres", league: "NHL", name: "buffalo-sabres" },
  { team: "Calgary Flames", league: "NHL", name: "calgary-flames" },
  { team: "Carolina Hurricanes", league: "NHL", name: "carolina-hurricanes" },
  { team: "Charlotte Checkers", league: "AHL", name: "charlotte-checkers" },
  { team: "Chicago Blackhawks", league: "NHL", name: "chicago-blackhawks" },
  { team: "Chicago Wolves", league: "AHL", name: "chicago-wolves" },
  { team: "Cleveland Monsters", league: "AHL", name: "cleveland-monsters" },
  { team: "Colorado Avalanche", league: "NHL", name: "colorado-avalanche" },
  { team: "Colorado Eagles", league: "AHL", name: "colorado-eagles" },
  {
    team: "Columbus Blue Jackets",
    league: "NHL",
    name: "columbus-blue-jackets",
  },
  { team: "Dallas Stars", league: "NHL", name: "dallas-stars" },
  { team: "Detroit Red Wings", league: "NHL", name: "detroit-red-wings" },
  { team: "Edmonton Oilers", league: "NHL", name: "edmonton-oilers" },
  { team: "Florida Panthers", league: "NHL", name: "florida-panthers" },
  {
    team: "Grand Rapids Griffins",
    league: "AHL",
    name: "grand-rapids-griffins",
  },
  { team: "Hartford Wolf Pack", league: "AHL", name: "hartford-wolf-pack" },
  { team: "Hershey Bears", league: "AHL", name: "hershey-bears" },
  { team: "Iowa Wild", league: "AHL", name: "iowa-wild" },
  { team: "Laval Rocket", league: "AHL", name: "laval-rocket" },
  {
    team: "Lehigh Valley Phantoms",
    league: "AHL",
    name: "lehigh-valley-phantoms",
  },
  { team: "Los Angeles Kings", league: "NHL", name: "los-angeles-kings" },
  { team: "Manitoba Moose", league: "AHL", name: "manitoba-moose" },
  { team: "Milwaukee Admirals", league: "AHL", name: "milwaukee-admirals" },
  { team: "Minnesota Wild", league: "NHL", name: "minnesota-wild" },
  { team: "Montreal Canadiens", league: "NHL", name: "montreal-canadiens" },
  { team: "Nashville Predators", league: "NHL", name: "nashville-predators" },
  { team: "New Jersey Devils", league: "NHL", name: "new-jersey-devils" },
  { team: "New York Islanders", league: "NHL", name: "new-york-islanders" },
  { team: "New York Rangers", league: "NHL", name: "new-york-tangers" },
  { team: "Ontario Reign", league: "NHL", name: "ontario-reign" },
  { team: "Ottawa Senators", league: "NHL", name: "ottawa-senators" },
  { team: "Philadelphia Flyers", league: "NHL", name: "philadelphia-flyers" },
  { team: "Pittsburgh Penguins", league: "NHL", name: "pittsburgh-penguins" },
  { team: "Providence Bruins", league: "AHL", name: "providence-bruins" },
  { team: "Rochester Americans", league: "AHL", name: "rochester-americans" },
  { team: "Rockford Ice Hogs", league: "AHL", name: "rockford-ice-hogs" },
  { team: "San Antonio Rampage", league: "AHL", name: "san-antonio-rampage" },
  { team: "San Diego Gulls", league: "AHL", name: "san-diego-gulls" },
  { team: "San Jose Barracuda", league: "AHL", name: "san-jose-barracuda" },
  { team: "San Jose Sharks", league: "NHL", name: "san-jose-sharks" },
  {
    team: "Springfield Thunderbirds",
    league: "AHL",
    name: "springfield-thunderbirds",
  },
  { team: "St. Louis Blues", league: "NHL", name: "st-louis-blues" },
  { team: "Stockton Heat", league: "AHL", name: "stockton-heat" },
  { team: "Syracuse Crunch", league: "AHL", name: "syracuse-crunch" },
  { team: "Tampa Bay Lightning", league: "NHL", name: "tampa-bay-lightning" },
  { team: "Texas Stars", league: "AHL", name: "texas-stars" },
  { team: "Toronto Maple Leafs", league: "NHL", name: "toronto-maple-leafs" },
  { team: "Toronto Marlies", league: "AHL", name: "toronto-marlies" },
  { team: "Tucson Roadrunners", league: "AHL", name: "tucson-roadrunners" },
  { team: "Utica Comets", league: "AHL", name: "utica-comets" },
  { team: "Vancouver Canucks", league: "NHL", name: "vancouver-canucks" },
  { team: "Vegas Golden Knights", league: "NHL", name: "vegas-golden-knights" },
  { team: "Washington Capitals", league: "NHL", name: "washington-capitals" },
  {
    team: "Wilkes Barre Scranton Penguins",
    league: "AHL",
    name: "wilkes-barre-scranton-penguins",
  },
  { team: "Winnipeg Jets", league: "NHL", name: "winnipeg-jets" },
];

const seedDB = async () => {
  const db = connectDatabase();
  try {
    const newSeason = {
      seasonId: "20002001",
      startDate: new Date(2000, 8, 26),
      endDate: new Date(2001, 5, 12),
    };

    const newSeason2 = {
      seasonId: "20052006",
      startDate: new Date(2005, 8, 26),
      endDate: new Date(2006, 5, 12),
    };

    const newSeason3 = {
      seasonId: "20112012",
      startDate: new Date(2011, 8, 26),
      endDate: new Date(2012, 5, 12),
    };

    const newSeason4 = {
      seasonId: "20192020",
      startDate: new Date(2019, 8, 26),
      endDate: new Date(2020, 5, 12),
    };

    await Season.insertMany([newSeason, newSeason2, newSeason3, newSeason4]);

    const newHire = {
      authorizedEmail: "carlotta.matt@gmail.com",
      email: "carlotta.matt@gmail.com",
      role: "admin",
      token: createSignupToken(),
      expiration: expirationDate().toDate(),
    };

    const newHire1 = {
      authorizedEmail: "member@example.com",
      email: "member@example.com",
      role: "member",
      token: createSignupToken(),
      expiration: expirationDate().toDate(),
    };

    const newHire2 = {
      authorizedEmail: "member55@example.com",
      email: "",
      role: "member",
      token: createSignupToken(),
      expiration: expirationDate().toDate(),
    };

    await Token.insertMany([newHire, newHire1, newHire2]);

    const adminPassword = await User.createPassword(password);

    const administrator = {
      email: admin,
      password: adminPassword,
      firstName: "Matt",
      lastName: "Carlotta",
      role: "admin",
      token: createRandomToken(),
    };

    const memberPassword = await User.createPassword(password);

    const staffMember = {
      email: "staffmember@example.com",
      password: memberPassword,
      firstName: "Staff",
      lastName: "Member",
      role: "staff",
      token: createRandomToken(),
    };

    const member = {
      email: "member@example.com",
      password: memberPassword,
      firstName: "Member",
      lastName: "Member",
      role: "employee",
      token: createRandomToken(),
    };

    const member2 = {
      email: "member2@example.com",
      password: memberPassword,
      firstName: "Member2",
      lastName: "Member2",
      role: "employee",
      token: createRandomToken(),
    };

    const member3 = {
      email: "member3@example.com",
      password: memberPassword,
      firstName: "Member3",
      lastName: "Member3",
      role: "employee",
      token: createRandomToken(),
    };

    const member4 = {
      email: "member4@example.com",
      password: memberPassword,
      firstName: "Member4",
      lastName: "Member4",
      role: "employee",
      token: createRandomToken(),
      status: "suspended",
    };

    const member5 = {
      email: "member5@example.com",
      password: memberPassword,
      firstName: "Member5",
      lastName: "Member5",
      role: "employee",
      token: createRandomToken(),
      status: "suspended",
    };

    const member6 = {
      email: "member6@example.com",
      password: memberPassword,
      firstName: "Member6",
      lastName: "Member6",
      role: "employee",
      token: createRandomToken(),
      status: "active",
    };

    const member7 = {
      email: "member7@example.com",
      password: memberPassword,
      firstName: "Member7",
      lastName: "Member7",
      role: "employee",
      token: createRandomToken(),
      status: "active",
    };

    const member8 = {
      email: "member8@example.com",
      password: memberPassword,
      firstName: "Member8",
      lastName: "Member8",
      role: "employee",
      token: createRandomToken(),
      status: "active",
    };

    const member9 = {
      email: "member9@example.com",
      password: memberPassword,
      firstName: "Member9",
      lastName: "Member9",
      role: "employee",
      token: createRandomToken(),
      status: "active",
    };

    const suspendedEmployee = {
      email: "suspended.employee@example.com",
      password: memberPassword,
      firstName: "Suspended",
      lastName: "Employee",
      role: "employee",
      token: createRandomToken(),
      status: "suspended",
    };

    await User.insertMany([
      administrator,
      staffMember,
      member,
      member2,
      member3,
      member4,
      member5,
      member6,
      member7,
      member8,
      member9,
      suspendedEmployee,
    ]);

    const adminAccount = await User.findOne({ email: administrator.email });

    const newEventCallTimes = [
      "2019-08-09T17:45:26-07:00",
      "2019-08-09T18:15:26-07:00",
      "2019-08-09T18:30:26-07:00",
      "2019-08-09T19:00:26-07:00",
    ];

    const newEvent = {
      team: "San Jose Sharks",
      opponent: "Los Angeles Kings",
      eventType: "Game",
      location: "Test Location",
      callTimes: newEventCallTimes,
      uniform: "Teal Jersey",
      seasonId: "20192020",
      eventDate: "2019-08-10T02:30:31.834Z",
      schedule: createSchedule(newEventCallTimes),
    };

    const newEventCallTimes2 = ["2019-08-09T19:00:38-07:00"];

    const newEvent2 = {
      team: "San Jose Barracuda",
      opponent: "San Diego Gulls",
      eventType: "Game",
      location: "SAP Center at San Jose",
      callTimes: newEventCallTimes2,
      uniform: "Barracuda Jacket",
      seasonId: "20192020",
      eventDate: "2019-08-11T02:30:30.036Z",
      schedule: createSchedule(newEventCallTimes2),
    };

    const newEventCallTimes3 = [
      "2019-08-19T17:15:43-07:00",
      "2019-08-19T17:45:43-07:00",
      "2019-08-19T18:15:43-07:00",
      "2019-08-19T19:00:43-07:00",
    ];

    const newEvent3 = {
      eventType: "Game",
      location: "SAP Center at San Jose",
      callTimes: newEventCallTimes3,
      uniform: "Sharks Teal Jersey",
      eventDate: "2019-08-21T02:30:36.000Z",
      notes: "",
      opponent: "Vegas Golden Knights",
      seasonId: "20192020",
      team: "San Jose Sharks",
      employeeResponses: [
        {
          _id: adminAccount._id,
          response: "I want to work.",
          notes: "",
        },
      ],
      schedule: createSchedule(newEventCallTimes3),
    };

    const newEventCallTimes4 = [
      "2019-10-19T17:15:43-07:00",
      "2019-10-19T17:45:43-07:00",
      "2019-10-19T18:15:43-07:00",
      "2019-10-19T19:00:43-07:00",
    ];

    const newEvent4 = {
      eventType: "Game",
      location: "SAP Center at San Jose",
      callTimes: newEventCallTimes4,
      uniform: "Sharks Teal Jersey",
      eventDate: "2019-10-21T02:30:36.000Z",
      notes: "",
      opponent: "Dallas Stars",
      seasonId: "20192020",
      team: "San Jose Sharks",
      employeeResponses: [
        {
          _id: adminAccount._id,
          response: "I want to work.",
          notes: "",
        },
      ],
      schedule: createSchedule(newEventCallTimes4),
    };

    const newEventCallTimes5 = [
      "2019-10-31T17:15:43-07:00",
      "2019-10-31T17:45:43-07:00",
      "2019-10-31T18:15:43-07:00",
      "2019-10-31T19:00:43-07:00",
    ];

    const newEvent5 = {
      eventType: "Game",
      location: "SAP Center at San Jose",
      callTimes: newEventCallTimes5,
      uniform: "Sharks Teal Jersey",
      eventDate: "2019-10-31T02:30:36.000Z",
      notes: "",
      opponent: "Arizona Coyotes",
      seasonId: "20192020",
      team: "San Jose Sharks",
      schedule: createSchedule(newEventCallTimes5),
    };

    const newEventCallTimes6 = ["2019-09-06T16:00:00-07:00"];

    const newEvent6 = {
      eventType: "Game",
      location: "SAP Center at San Jose",
      callTimes: newEventCallTimes6,
      uniform: "Barracuda Jacket",
      eventDate: "2019-09-06T16:30:36.000Z",
      notes: "",
      opponent: "San Diego Gulls",
      seasonId: "20192020",
      team: "San Jose Barracuda",
      schedule: createSchedule(newEventCallTimes6),
    };

    const newEventCallTimes7 = ["2019-09-07T16:00:00-07:00"];

    const newEvent7 = {
      eventType: "Game",
      location: "SAP Center at San Jose",
      callTimes: newEventCallTimes7,
      uniform: "Barracuda Jacket",
      eventDate: "2019-09-07T16:30:36.000Z",
      notes: "Star Wars night!",
      opponent: "San Diego Gulls",
      seasonId: "20192020",
      team: "San Jose Barracuda",
      schedule: createSchedule(newEventCallTimes7),
    };

    const newEventCallTimes8 = ["2019-09-08T16:00:00-07:00"];

    const newEvent8 = {
      eventType: "Game",
      location: "SAP Center at San Jose",
      callTimes: newEventCallTimes8,
      uniform: "Barracuda Jacket",
      eventDate: "2019-09-08T16:30:36.000Z",
      notes: "Bring a dog!",
      opponent: "San Diego Gulls",
      seasonId: "20192020",
      team: "San Jose Barracuda",
      schedule: createSchedule(newEventCallTimes8),
    };

    await Event.insertMany([
      newEvent,
      newEvent2,
      newEvent3,
      newEvent4,
      newEvent5,
      newEvent6,
      newEvent7,
      newEvent8,
    ]);

    await Team.insertMany(teams);

    const form1 = {
      expirationDate: new Date("2000-08-10T07:00:00.000Z"),
      startMonth: new Date("2000-08-01T07:00:00.000Z"),
      endMonth: new Date("2000-08-31T07:00:00.000Z"),
      notes: "Form 1",
      seasonId: "20002001",
    };

    const form2 = {
      expirationDate: new Date("2005-08-10T07:00:00.000Z"),
      startMonth: new Date("2005-08-01T07:00:00.000Z"),
      endMonth: new Date("2005-08-31T07:00:00.000Z"),
      notes: "Form 2",
      seasonId: "20052006",
    };

    const form3 = {
      expirationDate: new Date("2011-08-10T07:00:00.000Z"),
      startMonth: new Date("2011-08-01T07:00:00.000Z"),
      endMonth: new Date("2011-08-31T07:00:00.000Z"),
      notes: "Form 3",
      seasonId: "20112012",
    };

    const form4 = {
      expirationDate: new Date("2099-08-10T07:00:00.000Z"),
      startMonth: new Date("2019-08-01T07:00:00.000Z"),
      endMonth: new Date("2019-08-31T07:00:00.000Z"),
      notes: "Form 4",
      seasonId: "20192020",
    };

    const form5 = {
      expirationDate: new Date("2099-08-10T07:00:00.000Z"),
      startMonth: new Date("2019-09-01T07:00:00.000Z"),
      endMonth: new Date("2019-09-30T07:00:00.000Z"),
      notes: "Form 5",
      seasonId: "20192020",
    };

    const form6 = {
      expirationDate: new Date("2099-08-10T07:00:00.000Z"),
      startMonth: new Date("2019-10-01T07:00:00.000Z"),
      endMonth: new Date("2019-10-31T07:00:00.000Z"),
      notes: "Form 6",
      seasonId: "20192020",
    };

    await Form.insertMany([form1, form2, form3, form4, form5, form6]);

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
/* eslint-enable no-console */
