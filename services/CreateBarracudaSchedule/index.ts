import cheerio from "cheerio";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import {
  createDate,
  createSchedule,
  getStartOfNextNextMonth,
  toCapitalize
} from "~helpers";
import { errorMessage, infoMessage } from "~loggers";
import { Event, Season } from "~models";
import { ahlAPI } from "~utils/axiosConfig";
import {
  barracudaEventFormat,
  fullyearFormat,
  monthnameFormat
} from "~utils/dateFormats";
import { IEvent } from "~types";

/**
 * Creates Barracuda events that are 2 months from now for next months schedule.
 *
 * @function CreateBarracudaSchedule
 */
const CreateBarracudaSchedule = async (): Promise<void> => {
  try {
    const events = [] as Array<IEvent>;

    // start of next month
    const startMonth = getStartOfNextNextMonth().toDate();

    // locate season that encapulates next month
    const existingSeason = await Season.findOne(
      {
        startDate: { $lte: startMonth },
        endDate: { $gte: startMonth }
      },
      { seasonId: 1 }
    );
    /* istanbul ignore next */
    if (!existingSeason)
      throw String("Unable to locate a seasonId associated with that month.");

    const { seasonId } = existingSeason;

    const res = await ahlAPI.get("games");

    const data = get(res, ["data"]);
    const $ = cheerio.load(data);
    const nextNextMonth = getStartOfNextNextMonth();
    const nextNextMonthName = nextNextMonth.format(monthnameFormat);
    const currentYear = nextNextMonth.format(fullyearFormat);

    const currentMonthSchedule = $(`#${nextNextMonthName}${currentYear}`);

    currentMonthSchedule.find(".entry.clearfix").each((_i, row) => {
      const $row = $(row);
      const location = $row
        .find(".game_vs_message")
        .find(".home-or-away")
        .text()
        .trim();

      if (location === "Home") {
        const $eventDate = $row.find(".date-time");
        const $team = $row.find(".team-info");

        // MMMM D
        const date = toCapitalize(
          $eventDate
            .find(".date")
            .text()
            .replace(/^[^,]+,/, "")
            .trim()
        );

        // h:mma
        const time = $eventDate.find(".time").text().trim().toLowerCase();

        const opponent = toCapitalize($team.find(".team-title").text().trim());

        const eventDate = createDate(
          `${date} ${currentYear} ${time}`,
          barracudaEventFormat
        ).format();

        const callTimes = [
          createDate(eventDate).subtract(30, "minutes").format()
        ];

        events.push({
          eventType: "Game",
          location: "SAP Center at San Jose",
          callTimes,
          eventDate,
          opponent,
          schedule: createSchedule(callTimes),
          seasonId,
          team: "San Jose Barracuda",
          notes: ""
        });
      }
    });

    if (!isEmpty(events)) await Event.insertMany(events);

    infoMessage(`Processed Barracuda Events... ${events.length}`);
  } catch (err: any) {
    errorMessage(err.toString());
  }
};

export default CreateBarracudaSchedule;
