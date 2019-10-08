import { Schema, model } from "mongoose";
import { convertDateToISO } from "shared/helpers";

// monthly form
const formSchema = new Schema({
  startMonth: { type: Date, required: true },
  endMonth: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  seasonId: { type: String, required: true },
  sendEmailNotificationsDate: {
    type: Date,
    default: convertDateToISO(Date.now()),
  },
  sentEmails: { type: Boolean, default: false },
  notes: String,
});

export default model("Form", formSchema);
