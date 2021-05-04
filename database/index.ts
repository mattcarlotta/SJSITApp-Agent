// Since this is being utilized by "seedDB" and "teardownDB" within Jest, paths must be relative

import bluebird from "bluebird";
import mongoose from "mongoose";
import { errorMessage, infoMessage } from "../loggers";

const { DATABASE, NODE_ENV } = process.env;
const inTesting = NODE_ENV === "test";

const options = {
  useNewUrlParser: true, // avoids DeprecationWarning: current URL string parser is deprecated
  useCreateIndex: true, // avoids DeprecationWarning: collection.ensureIndex is deprecated.
  useFindAndModify: false, // avoids DeprecationWarning: collection.findAndModify is deprecated.
  useUnifiedTopology: true // avoids DeprecationWarning: current Server Discovery and Monitoring engine is deprecated
};

mongoose.Promise = bluebird;

export const createConnectionToDatabase = (): mongoose.Connection & {
  then: Promise<mongoose.Connection>["then"];
  catch: Promise<mongoose.Connection>["catch"];
} => mongoose.createConnection(`mongodb://localhost/${DATABASE}`, options);

export const connectToDB = (): Promise<typeof mongoose> =>
  mongoose.connect(`mongodb://localhost/${DATABASE}`, options);

if (!inTesting) {
  mongoose.connection.on(
    "connected",
    () => infoMessage(`Connected to ${DATABASE}`) // log mongodb connection established
  );

  mongoose.connection.on(
    "disconnected",
    () => infoMessage(`Disconnected from ${DATABASE}`) // log mongodb connection disconnected
  );

  mongoose.connection.on(
    "error",
    () => errorMessage(`Connection error to ${DATABASE}`) // log mongodb connection error
  );

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      infoMessage(`Connection was manually terminated from ${DATABASE}`);
      process.exit(0);
    });
  });
}
