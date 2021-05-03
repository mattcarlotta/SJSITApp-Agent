import { Document, Schema, model } from "mongoose";

export interface IMailDocument extends Document {
  // _id?: Types.ObjectId;
  message: string;
  sendTo: Array<string>;
  sendFrom: string;
  sendDate: Date | string;
  status: string;
  subject: string;
}

// email
const mailSchema = new Schema<IMailDocument>({
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


const MailModel = model("Mail", mailSchema);

export default MailModel;
