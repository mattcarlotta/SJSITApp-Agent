import { Schema, model } from "mongoose";
import type { ISeasonDocument } from "~types";

// current season year
const seasonSchema = new Schema<ISeasonDocument>({
  seasonId: { type: String, unique: true, lowercase: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

const SeasonModel = model<ISeasonDocument>("Season", seasonSchema);

export default SeasonModel;
