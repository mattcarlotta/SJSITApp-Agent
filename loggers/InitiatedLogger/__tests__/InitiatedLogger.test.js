import chalk from "chalk";
import moment from "moment-timezone";
import { initiatedLogger } from "~loggers";

describe("Initiated Logger", () => {
  it("calls console.log with a timestamped message", () => {
    console.log(initiatedLogger());
    expect(console.log).toHaveBeenCalledWith(
      `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
        `Polling service was initiated on ${moment()
          .tz("America/Los_Angeles")
          .format("MMMM Do YYYY @ h:mm:ssa")}.`
      )}`
    );
  });
});
