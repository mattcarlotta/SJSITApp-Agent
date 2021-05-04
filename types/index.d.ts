import type { Moment } from "moment-timezone";
import type { Model, Document, Types } from "mongoose";

/// EVENTS ///
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

export type TEventMemberSchedule = Omit<IEvent, "schedule"> & {
  email: string;
  callTime: string;
};

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

export type TEventsSorted = Array<{
  email: string;
  events: Array<TEventMemberSchedule>;
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
  _id: string;
  schedule: Array<{
    title: string;
    employeeIds: Array<{
      email: string;
      firstName: string;
      lastName: string;
      emailReminders?: boolean;
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
///

/// FORMS ///
export interface IFormDocument extends Document {
  // _id?: Types.ObjectId;
  startMonth: Date;
  endMonth: Date;
  expirationDate: Date;
  seasonId: string;
  sendEmailNotificationsDate: Date | string;
  sentEmails?: boolean;
  notes?: string;
}
///

/// MAIL ///
export type TEmail = {
  message: string;
  sendTo: Array<string>;
  sendFrom: string;
  sendDate: Date | string;
  subject: string;
};

export type TEmailProps = {
  _id: string;
  expirationDate: string;
  endMonth: string;
  startMonth: string;
  notes?: string;
};

export type TMailDocument = Document & TEmail & { status: string };
///

/// SEASON ///
export interface ISeasonDocument extends Document {
  // _id?: Types.ObjectId;
  seasonId: string;
  startDate: Date;
  endDate: Date;
}
///

/// SERVICE ///
export interface IServiceDocument extends Document {
  // _id?: Types.ObjectId;
  automatedOnline: boolean;
  emailOnline: boolean;
  eventOnline: boolean;
  eventDay: string;
  eventMonth: string;
  eventTime: string;
  formReminderOnline: boolean;
  formReminderDay: string;
  formReminderMonth: string;
  formReminderTime: string;
  scheduleOnline: boolean;
  scheduleDay: string;
  scheduleMonth: string;
  scheduleTime: string;
}
///

/// TEAM ///
export interface ITeamDocument extends Document {
  // _id?: Types.ObjectId;
  league: string;
  team: string;
  name: string;
}
///

/// TOKEN ///
export interface ITokenDocument extends Document {
  // _id?: Types.ObjectId;
  token: string;
  authorizedEmail: string;
  email?: string;
  role: string;
  expiration: Date;
}
///

/// USER ///
export type TActiveMembers = Array<{
  _id: Types.ObjectId;
  name: string;
}>;

export type TScheduledEventsForMember = Array<{
  _id: Types.ObjectId;
  eventCount: number;
}>;

export interface IUser {
  // _id?: Types.ObjectId;
  avatar?: string;
  email: string;
  role?: string;
  status?: string;
  firstName: string;
  lastName: string;
  password: string;
  registered?: Date;
  token: string;
  emailReminders?: boolean;
}

export interface UserSchedule extends IUser {
  response: string;
  notes?: string;
}

export interface IUserDocument extends Document {
  // _id?: Types.ObjectId;
  avatar?: string;
  email: string;
  role?: string;
  status?: string;
  firstName: string;
  lastName: string;
  password: string;
  registered?: Date;
  token: string;
  emailReminders?: boolean;
}

export type TUserModel = Model<IUserDocument>;
///

/// API EVENTS ///
export type TNHLResponseData = {
  copyright: string;
  totalItems: number;
  totalEvents: number;
  totalGames: number;
  totalMatches: number;
  wait: number;
  dates: Array<{
    date: string;
    totalItems: number;
    totalEvents: 0;
    totalGames: 1;
    totalMatches: 0;
    games: Array<{
      gamePk: number;
      link: string;
      gameType: string;
      season: string;
      gameDate: string;
      status: {
        abstractGameState: string;
        codedGameState: string;
        detailedState: string;
        statusCode: string;
        startTimeTBD: boolean;
      };
      teams: {
        away: {
          leagueRecord: {
            wins: number;
            losses: number;
            ot: number;
            type: string;
          };
          score: number;
          team: {
            id: number;
            name: string;
            link: string;
          };
        };
        home: {
          leagueRecord: {
            wins: number;
            losses: number;
            ot: number;
            type: string;
          };
          score: number;
          team: {
            id: number;
            name: string;
            link: string;
          };
        };
      };
      venue: {
        id: number;
        name: string;
        link: string;
      };
      content: {
        link: string;
      };
    }>;
  }>;
  events: Array<any>;
  matches: Array<any>;
};

export { Moment };
