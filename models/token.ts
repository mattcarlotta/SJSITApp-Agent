import { Schema, model } from "mongoose";
import type { ITokenDocument } from "~types";

// token templates
const tokenSchema = new Schema({
  token: { type: String, required: true, unique: true },
  authorizedEmail: { type: String, lowercase: true, unique: true },
  email: { type: String, lowercase: true },
  role: { type: String, lowercase: true, required: true },
  expiration: {
    type: Date,
    required: true
  }
});

const TokenModel = model<ITokenDocument>("Token", tokenSchema);

export default TokenModel;
