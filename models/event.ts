import { Schema, model } from "mongoose";
import type { IEventDocument } from "~types";

// event
const eventSchema = new Schema<IEventDocument>({
  eventType: { type: String, default: "Game", required: true },
  eventDate: { type: Date, required: true },
  location: { type: String, default: "SAP Center at San Jose" },
  employeeResponses: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      response: { type: String, required: true },
      notes: String
    }
  ],
  schedule: [
    {
      _id: { type: String, required: true },
      title: String,
      employeeIds: [{ type: Schema.Types.ObjectId, ref: "User" }]
    }
  ],
  scheduledIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  seasonId: { type: String, required: true },
  team: { type: String, required: true },
  opponent: String,
  callTimes: { type: Array, of: String, required: true },
  uniform: { type: String, default: "Sharks Teal Jersey" },
  notes: String,
  sentEmailReminders: { type: Boolean, default: false }
});

const EventModel = model<IEventDocument>("Event", eventSchema);

export default EventModel;
