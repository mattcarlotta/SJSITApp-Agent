import { Document, Schema, model } from "mongoose";

export interface ITokenDocument extends Document {
  // _id?: Types.ObjectId;
  token: string;
  authorizedEmail: string;
  email?: string;
  role: string;
  expiration: Date;
}

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

const TokenModel = model("Token", tokenSchema);

export default TokenModel;
