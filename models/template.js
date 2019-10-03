import { Schema, model } from "mongoose";

// email templates
const templateSchema = new Schema({
  icon: String,
  subject: String,
  fromSender: String,
  message: String,
  templateName: { type: String, unique: true },
  team: { type: String, unique: true, lowercase: true },
  uniquetemplateName: { type: String, unique: true, lowercase: true },
});

export default model("Template", templateSchema);
