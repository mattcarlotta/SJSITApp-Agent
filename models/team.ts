import { Schema, model } from "mongoose";
import type { ITeamDocument } from "~types";

// NHL/AHL teams
const teamSchema = new Schema<ITeamDocument>({
  league: { type: String, required: true },
  team: { type: String, unique: true },
  name: { type: String, unique: true, lowercase: true }
});

const TeamModel = model<ITeamDocument>("Team", teamSchema);

export default TeamModel;
