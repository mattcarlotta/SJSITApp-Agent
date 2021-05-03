import cheerio from "cheerio";
import moment from "~utils/momentWithTimeZone";
import { ahlAPI } from "~utils/axiosConfig";

const ScrapAHL = async (): Promise<void> => {
  try {
    const res = await ahlAPI.get("games");
    const $ = cheerio.load(res.data);
    const currentMonth = moment().format("MMMMYYYY");
    const currentMonthSchedule = $(`#${currentMonth}`);

    currentMonthSchedule.find(".entry.clearfix").each((_i, row) => {
      const $row = $(row);
      const location = $row
        .find(".game_vs_message")
        .find(".home-or-away")
        .text()
        .trim();

      if (location === "Home") {
        const $eventDate = $row.find(".date-time");
        const $team = $row.find("team-info");

        const date = $eventDate.find(".date").text().trim();
        const time = $eventDate.find(".time").text().trim();
        const team = $team.find(".team-title").text().trim();
        console.log("event date/time", date, time, team);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export default ScrapAHL;
