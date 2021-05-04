import get from "lodash.get";
import { errorMessage, infoMessage } from "~loggers";
import { Event, Season } from "~models";
import {
  createDate,
  createSchedule,
  getEndOfMonth,
  getStartOfNextNextMonth
} from "~helpers";
import nhlAPI from "~utils/axiosConfig";
import { eventFormat } from "~utils/dateFormats";
import { IEvent } from "~types";

/**
 * Creates Sharks events for next months schedule
 *
 * @function CreateSharksSchedule
 */
const CreateSharksSchedule = async (): Promise<void> => {
  const events = [] as Array<IEvent>;
  try {
    // start of next month
    const startMonth = getStartOfNextNextMonth();

    // testing current month
    // const startMonth = moment().startOf("month");

    // end of next month
    const endMonth = getEndOfMonth(startMonth.toDate());

    // locate season that encapulates next month
    const existingSeason = await Season.findOne(
      {
        startDate: { $lte: startMonth.toDate() },
        endDate: { $gte: startMonth.toDate() }
      },
      { seasonId: 1 }
    );
    /* istanbul ignore next */
    if (!existingSeason)
      throw String("Unable to locate a seasonId associated with that month.");

    const { seasonId } = existingSeason;

    // fetch Sharks schedule for next month from stats.nhl.com
    const res = await nhlAPI.get(
      `schedule?teamId=28&startDate=${startMonth.format(
        eventFormat
      )}&endDate=${endMonth.format(eventFormat)}`
    );

    const dates = get(res, ["data", "dates"]);
    if (!dates) throw String("Unable to retrieve next month's game schedule.");

    // build an array of events
    dates.forEach(({ games }) => {
      // search through data and check to see if Sharks are at home
      const isHomeGame = games.find(
        ({ teams }) => teams.home.team.name === "San Jose Sharks"
      );

      // if they're at home...
      if (isHomeGame) {
        const { gameDate, venue, teams } = isHomeGame;

        // get team and opponent names
        const team = get(teams, ["home", "team", "name"]);
        const opponent = get(teams, ["away", "team", "name"]);

        const date = createDate(gameDate).format("MMMM Do YYYY, hh:mm a");

        // generate callTimes based upon the date
        const callTimes = [120, 90, 60, 30].map(time =>
          createDate(date, "MMMM Do YYYY, hh:mm a")
            .subtract(time, "minutes")
            .format()
        );

        // store results in accumulator
        events.push({
          eventType: "Game",
          location: venue.name,
          callTimes,
          eventDate: gameDate,
          opponent,
          schedule: createSchedule(callTimes),
          seasonId,
          team,
          notes: ""
        });
      }
    });

    await Event.insertMany(events);

    infoMessage(`Processed Sharks Events... ${events.length}`);
  } catch (err) {
    errorMessage(err);
  }
};

export default CreateSharksSchedule;
