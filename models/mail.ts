import { Schema, model } from "mongoose";
import type { TMailDocument } from "~types";

// email
const mailSchema = new Schema<TMailDocument>({
  message: { type: String, required: true },
  sendTo: [{ type: String, required: true }],
  sendFrom: { type: String, required: true },
  sendDate: {
    type: Date,
    required: true
  },
  status: { type: String, default: "unsent" },
  subject: { type: String, required: true }
});

const MailModel = model<TMailDocument>("Mail", mailSchema);

export default MailModel;
