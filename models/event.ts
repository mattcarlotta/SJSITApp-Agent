import { Document, Schema, model, Types } from "mongoose";

type TId = Types.ObjectId | string;

export type TEventAccResponses = Array<{
  id: string;
  value: number;
}>;

export type TEventAggResponses = Array<{
  // _id: TId;
  responses: Array<string>;
}>;

export type TEventEmptySchedule = Array<{
  _id: string;
  employeeIds: Array<never>;
}>;

export type TEventCountForMember = Array<{
  name: string;
  "Event Count": number;
}>;

export type TEventMemberAvailability = Array<{
  _id: TId;
  availability: number;
}>;

export type TEventMemberAvailabilityAvg = Array<{
  id: string;
  value: number;
}>;

export type TEventMemberAvailabilityAvgs = Array<{
  id: string;
  availability: number;
}>;

export type TEventScheduleIds = Array<{
  _id: string;
  title?: string;
  employeeIds: Array<string>;
}>;

export type TEventSchedule = Array<{
  _id: string;
  title?: string;
  employeeIds: Array<Types.ObjectId>;
}>;

export type TEventResponse = {
  id: string;
  value: string;
  notes?: string;
  updateEvent: boolean;
};

export type TEventResponses = Array<{
  _id: Types.ObjectId;
  response: string;
  notes?: string;
}>;

export interface IEvent {
  // _id?: Types.ObjectId;
  eventType: string;
  eventDate: string;
  location?: string;
  employeeResponses?: TEventResponses;
  schedule: TEventSchedule;
  scheduledIds?: Array<any>;
  seasonId: string;
  team: string;
  opponent?: string;
  callTimes: Array<string>;
  uniform?: string;
  notes?: string;
  sentEmailReminders?: boolean;
}

export type TAggEvents = Omit<IEvent, "schedule"> & {
  schedule: Array<{
    title: string;
    employeeIds: Array<{
      firstName: string;
      lastName: string;
    }>;
  }>;
};

export type TEventMemberSchedule = IEvent & {
  callTime: string;
};

export interface IEventDocument extends Document {
  // _id?: Types.ObjectId;
  eventType: string;
  eventDate: string;
  location?: string;
  employeeResponses?: TEventResponses;
  schedule: TEventSchedule;
  scheduledIds?: Array<any>;
  seasonId: string;
  team: string;
  opponent?: string;
  callTimes: Array<string>;
  uniform?: string;
  notes?: string;
  sentEmailReminders?: boolean;
}

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

const EventModel = model("Event", eventSchema);

export default EventModel;
