import { Schema, model } from "mongoose";
import type { IServiceDocument } from "~types";

// current season year
const serviceSchema = new Schema<IServiceDocument>({
  automatedOnline: { type: Boolean, default: true },
  emailOnline: { type: Boolean, default: true },
  eventOnline: { type: Boolean, default: true },
  eventDay: { type: String, required: true },
  eventMonth: { type: String, required: true },
  eventTime: { type: String, required: true },
  formReminderOnline: { type: Boolean, default: true },
  formReminderDay: { type: String, required: true },
  formReminderMonth: { type: String, required: true },
  formReminderTime: { type: String, required: true },
  scheduleOnline: { type: Boolean, default: true },
  scheduleDay: { type: String, required: true },
  scheduleMonth: { type: String, required: true },
  scheduleTime: { type: String, required: true }
});

const ServiceModel = model<IServiceDocument>("Service", serviceSchema);

export default ServiceModel;
