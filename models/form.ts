import { Schema, model } from "mongoose";
import type { IFormDocument } from "~types";

// monthly form
const formSchema = new Schema<IFormDocument>({
  startMonth: { type: Date, required: true },
  endMonth: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  seasonId: { type: String, required: true },
  sendEmailNotificationsDate: {
    type: Date,
    required: true
  },
  sentEmails: { type: Boolean, default: false },
  notes: String
});

const FormModel = model<IFormDocument>("Form", formSchema);

export default FormModel;
