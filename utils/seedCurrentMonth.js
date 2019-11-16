import moment from "moment-timezone";
import get from "lodash/get";
import { connectDatabase } from "database";
import { Event, Form, Season } from "models";
import { createSchedule, getStartOfMonth, getEndOfMonth } from "shared/helpers";
import nhlAPI from "utils/axiosConfig";

const format = "YYYY-MM-DD";

(async () => {
  const db = connectDatabase();
  const events = [];
  try {
    // start of current month
    const startMonth = getStartOfMonth();
    const endMonth = getEndOfMonth(startMonth);
    const startOfNextMonth = moment()
      .add(1, "months")
      .startOf("month");
    const endOfNextMonth = getEndOfMonth(startOfNextMonth);

    // stringified months
    const beginOfMonth = startMonth.format(format);
    const endNextMonth = endOfNextMonth.format(format);

    // locate season that encapulates next month
    const existingSeason = await Season.findOne(
      {
        startDate: { $lte: beginOfMonth },
        endDate: { $gte: beginOfMonth },
      },
      { seasonId: 1 },
    );
    /* istanbul ignore next */
    if (!existingSeason) throw "Unable to locate a seasonId associated with that month.";

    const { seasonId } = existingSeason;

    // fetch Sharks schedule for next month from stats.nhl.com
    const res = await nhlAPI.get(
      `schedule?teamId=28&startDate=${beginOfMonth}&endDate=${endNextMonth}`,
    );

    const dates = get(res, ["data", "dates"]);
    if (!dates) throw "Unable to retrieve next month's game schedule.";

    // build an array of events
    dates.forEach(({ games }) => {
      // search through data and check to see if Sharks are at home
      const isHomeGame = games.find(
        ({ teams }) => teams.home.team.name === "San Jose Sharks",
      );

      // if they're at home...
      if (isHomeGame) {
        const {
          gameDate,
          venue: { name: location },
          teams,
        } = isHomeGame;

        // get team and opponent names
        const team = get(teams, ["home", "team", "name"]);
        const opponent = get(teams, ["away", "team", "name"]);

        const date = moment(gameDate).format("MMMM Do YYYY, hh:mm a");

        // generate callTimes based upon the date
        const callTimes = [120, 105, 90, 75, 30].map(time => moment(date, "MMMM Do YYYY, hh:mm a")
          .subtract(time, "minutes")
          .format());

        // store results in accumulator
        events.push({
          eventType: "Game",
          location,
          callTimes,
          eventDate: gameDate,
          opponent,
          schedule: createSchedule(callTimes),
          seasonId,
          team,
          notes: "",
        });
      }
    });

    await Event.insertMany(events);

    // create current months A/P form
    const currentMonthForm = {
      seasonId,
      startMonth: startMonth.format(),
      endMonth: endMonth.format(),
      expirationDate: moment()
        .startOf("month")
        .add(6, "days")
        .endOf("day")
        .format(),
      sendEmailNotificationsDate: startMonth.format(),
      sentEmails: true,
      notes: "",
    };

    // create next months A/P form
    const nextMonthForm = {
      seasonId,
      startMonth: startOfNextMonth.format(),
      endMonth: endOfNextMonth.format(),
      expirationDate: moment()
        .add(1, "months")
        .startOf("month")
        .add(6, "days")
        .endOf("day")
        .format(),
      sendEmailNotificationsDate: startOfNextMonth.format(),
      sentEmails: false,
      notes: "",
    };

    await Form.insertMany([currentMonthForm, nextMonthForm]);

    return console.log(
      "\n\x1b[7m\x1b[32;1m PASS \x1b[0m \x1b[2mutils/\x1b[0m\x1b[1mseeds.js",
    );
  } catch (err) {
    return console.log(
      `\n\x1b[7m\x1b[31;1m FAIL \x1b[0m \x1b[2mutils/\x1b[0m\x1b[31;1mseedDB.js\x1b[0m\x1b[31m\n${err.toString()}\x1b[0m`,
    );
  } finally {
    await db.close();
    process.exit(0);
  }
})();
