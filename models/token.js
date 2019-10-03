import { Schema, model } from "mongoose";

// token templates
const tokenSchema = new Schema({
  // seasonId: { type: String, lowercase: true },
  token: { type: String, required: true, unique: true },
  authorizedEmail: { type: String, lowercase: true, unique: true },
  email: { type: String, default: "", lowercase: true },
  role: { type: String, required: true },
  expiration: {
    type: Date,
  },
});

export default model("Token", tokenSchema);
