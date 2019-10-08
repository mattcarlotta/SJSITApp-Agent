import { Schema, model } from "mongoose";
import { convertDateToISO } from "shared/helpers";

// email
const mailSchema = new Schema({
  message: { type: String, required: true },
  sendTo: [{ type: String, required: true }],
  sendFrom: { type: String, required: true },
  sendDate: { type: Date, default: convertDateToISO(Date.now()) },
  status: { type: String, default: "unsent" },
  subject: { type: String, required: true },
});

export default model("Mail", mailSchema);
