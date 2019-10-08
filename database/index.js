/* istanbul ignore file */
/* eslint-disable */
import bluebird from "bluebird";
import mongoose from "mongoose";
import chalk from "chalk";

const { DATABASE, NODE_ENV } = process.env;
const inTesting = NODE_ENV === "testing";

export const options = {
  useNewUrlParser: true, // avoids DeprecationWarning: current URL string parser is deprecated
  useCreateIndex: true, // avoids DeprecationWarning: collection.ensureIndex is deprecated.
  useFindAndModify: false, // avoids DeprecationWarning: collection.findAndModify is deprecated.
  useUnifiedTopology: true, // avoids DeprecationWarning: current Server Discovery and Monitoring engine is deprecated
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
        `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.blue(
          `Connected to ${DATABASE}`,
        )}\n`,
      ), // log mongodb connection established
  );

  mongoose.connection.on(
    "disconnected",
    () =>
      console.log(
        `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.rgb(
          34,
          155,
          127,
        )(`Disconnected from ${DATABASE}`)}`,
      ), // log mongodb connection disconnected
  );

  mongoose.connection.on(
    "error",
    () =>
      console.log(
        `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.red(
          `Connection error to ${DATABASE}`,
        )}`,
      ), // log mongodb connection error
  );

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log(
        `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.magenta(
          `Connection was manully terminated from ${DATABASE}`,
        )}`,
      );
      process.exit(0);
    });
  });
}

/* eslint-enable */
