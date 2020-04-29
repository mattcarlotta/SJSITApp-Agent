/* istanbul ignore file */
/* eslint-disable */
import "~env";
import bluebird from "bluebird";
import mongoose from "mongoose";
import chalk from "chalk";

const { DATABASE, inTesting } = process.env;

export const options = {
  useNewUrlParser: true, // avoids DeprecationWarning: current URL string parser is deprecated
  useCreateIndex: true, // avoids DeprecationWarning: collection.ensureIndex is deprecated.
  useFindAndModify: false, // avoids DeprecationWarning: collection.findAndModify is deprecated.
  useUnifiedTopology: true // avoids DeprecationWarning: current Server Discovery and Monitoring engine is deprecated
};

//= ===========================================================//
//* MONGO DB CONFIG */
//= ===========================================================//
mongoose.connect(`mongodb://localhost/${DATABASE}`, options); // connect to our mongodb database

mongoose.Promise = bluebird; // bluebird for mongoose promises

export const connectDatabase = () =>
  mongoose.createConnection(`mongodb://localhost/${DATABASE}`, options);

if (!inTesting) {
  mongoose.connection.on(
    "connected",
    () =>
      console.log(
        `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
          `Connected to ${DATABASE}`
        )}\n`
      ) // log mongodb connection established
  );

  mongoose.connection.on(
    "disconnected",
    () =>
      console.log(
        `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.rgb(
          34,
          155,
          127
        )(`Disconnected from ${DATABASE}`)}\n`
      ) // log mongodb connection disconnected
  );

  mongoose.connection.on(
    "error",
    () =>
      console.log(
        `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" ERROR ")} ${chalk.red(
          `Connection error to ${DATABASE}\n`
        )}`
      ) // log mongodb connection error
  );

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log(
        `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(
          " INFO "
        )} ${chalk.magenta(
          `Connection was manually terminated from ${DATABASE}`
        )}\n`
      );
      process.exit(0);
    });
  });
}

/* eslint-enable */
