import moment from "moment-timezone";
import { Schema, model } from "mongoose";

// monthly form
const formSchema = new Schema({
  startMonth: { type: Date, required: true },
  endMonth: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  seasonId: { type: String, required: true },
  sendEmailNotificationsDate: {
    type: Date,
    default: moment.tz("America/Los_Angeles").toDate(),
  },
  sentEmails: { type: Boolean, default: false },
  notes: String,
});

export default model("Form", formSchema);
