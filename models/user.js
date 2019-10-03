import { Schema, model } from "mongoose";
import { convertDateToISO } from "shared/helpers";

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  role: { type: String, default: "employee" },
  status: { type: String, default: "active" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  registered: { type: Date, default: convertDateToISO(Date.now()) },
  token: { type: String, unique: true },
  timesAvailable: Number,
  timesUnavailable: Number
});

export default model("User", userSchema);
