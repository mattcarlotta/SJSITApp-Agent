import type { Moment } from "moment-timezone";
import type { Document, Types } from "mongoose";

/// EVENTS ///
type TId = Types.ObjectId | string;

export type TEventEmptySchedule = Array<{
  _id: string;
  employeeIds: Array<never>;
}>;

export type TEventSchedule = Array<{
  _id: string;
  title?: string;
  employeeIds: Array<TId>;
}>;

export type TEventResponses = Array<{
  _id: TId;
  response: string;
  notes?: string;
}>;

export interface IEvent {
  // _id?: TId;
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

export type TEventMemberSchedule = Omit<IEvent, "schedule"> & {
  email: string;
  callTime: string;
};

export type TEventsSorted = Array<{
  email: string;
  events: Array<TEventMemberSchedule>;
}>;

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

export type TEventReminder = Omit<IEvent, "schedule"> & {
  callTime: string;
};

export interface IEventDocument extends Document {
  // _id?: TId;
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
  // _id?: TId;
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
  // _id?: TId;
  seasonId: string;
  startDate: Date;
  endDate: Date;
}
///

/// SERVICE ///
export interface IServiceDocument extends Document {
  // _id?: TId;
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
  // _id?: TId;
  league: string;
  team: string;
  name: string;
}
///

/// TOKEN ///
export interface ITokenDocument extends Document {
  // _id?: TId;
  token: string;
  authorizedEmail: string;
  email?: string;
  role: string;
  expiration: Date;
}
///

/// USER ///
export interface IUser {
  // _id?: TId;
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

export interface IUserDocument extends Document {
  // _id?: TId;
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
};

export { Moment };
