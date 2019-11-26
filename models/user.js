import { Schema, model } from "mongoose";
import moment from "moment-timezone";

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  role: { type: String, default: "employee" },
  status: { type: String, default: "active" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  registered: {
    type: Date,
    default: moment.tz("America/Los_Angeles").toDate(),
  },
  token: { type: String, unique: true },
  emailReminders: { type: Boolean, default: true },
});

export default model("User", userSchema);
