import { Schema, model } from "mongoose";

// current season year
const seasonSchema = new Schema({
  seasonId: { type: String, unique: true, lowercase: true },
  startDate: Date,
  endDate: Date,
});

export default model("Season", seasonSchema);
