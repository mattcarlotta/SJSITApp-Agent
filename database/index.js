/* istanbul ignore file */
/* eslint-disable */
import bluebird from "bluebird";
import mongoose from "mongoose";

const { DATABASE } = process.env;

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
