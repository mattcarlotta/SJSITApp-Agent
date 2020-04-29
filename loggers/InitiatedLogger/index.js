import chalk from "chalk";
import moment from "moment-timezone";

export default () =>
  `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
    `Polling service was initiated on ${moment()
      .tz("America/Los_Angeles")
      .format("MMMM Do YYYY @ h:mm:ssa")}.`
  )}`;
