import { Schema, model } from "mongoose";

// NHL/AHL teams
const teamSchema = new Schema({
  league: { type: String, required: true },
  team: { type: String, unique: true },
  name: { type: String, unique: true, lowercase: true },
});

export default model("Team", teamSchema);
