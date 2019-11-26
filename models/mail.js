import moment from "moment-timezone";
import { Schema, model } from "mongoose";

// email
const mailSchema = new Schema({
  message: { type: String, required: true },
  sendTo: [{ type: String, required: true }],
  sendFrom: { type: String, required: true },
  sendDate: {
    type: Date,
    default: moment.tz("America/Los_Angeles").toDate(),
  },
  status: { type: String, default: "unsent" },
  subject: { type: String, required: true },
});

export default model("Mail", mailSchema);
