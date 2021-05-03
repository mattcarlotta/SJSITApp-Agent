import { Document, Schema, model } from "mongoose";

export interface IServiceDocument extends Document {
  // _id?: Types.ObjectId;
  automatedOnline: boolean;
  emailOnline: boolean;
  eventOnline: boolean;
  eventDay: string;
  eventMonth: string;
  eventTime: string;
  formReminderOnline: boolean;
  formReminderDay: string;
  formReminderMonth: string;
  formReminderTime: string;
  scheduleOnline: boolean;
  scheduleDay: string;
  scheduleMonth: string;
  scheduleTime: string;
}

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

const ServiceModel = model(
  "Service",
  serviceSchema
);

export default ServiceModel;
