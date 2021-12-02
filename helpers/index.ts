/* eslint-disable no-control-regex */
import moment from "../utils/momentWithTimeZone";
import { serviceDateTimeFormat, fullyearFormat } from "../utils/dateFormats";
import type {
  Moment,
  TEventMemberSchedule,
  TEventEmptySchedule,
  TEventsSorted
} from "../types";

/**
 * Helper function to check if the current day exceeds another date.
 *
 * @function checkIfDatePassed
 * @param date - date
 * @returns {boolean}
 */
const checkIfDatePassed = (date: Date): boolean => moment().toDate() > date;

/**
 * Helper function to create a current date.
 *
 * @function createDate
 * @param date - string or date
 * @returns {Date}
 */
const createDate = (date?: Date | string, format?: string): Moment =>
  moment(date || Date.now(), format);

/**
 * Helper function to generate a schedule based upon calltimes.
 *
 * @function createSchedule
 * @param callTimes - an array of dates
 * @returns {TEventEmptySchedule} -[{ _id: string; employeeIds: [] }]
 */
const createSchedule = (callTimes: Array<string>): TEventEmptySchedule =>
  callTimes.map(time => ({
    _id: time,
    employeeIds: []
  }));

/**
 * Helper function to create a current date.
 *
 * @function endOfDay
 * @returns Date
 */
const endOfDay = (): Date => moment().endOf("day").toDate();

/**
 * Helper function to create a current date.
 *
 * @function endOfTomorrow
 * @returns string
 */
const endOfTomorrow = (): string =>
  moment().add(1, "day").endOf("day").format();

/**
 * Helper function to get a Date of current year.
 *
 * @function getCurrentYear
 * @returns Moment
 */
const getCurrentYear = (): Moment => moment().startOf("year");

/**
 * Helper function to get a end month date.
 *
 * @function getEndOfMonth
 * @param date - string or date
 * @returns {Moment}
 */
const getEndOfMonth = (date: Date | string): Moment =>
  moment(date).endOf("month");

/**
 * Helper function to create a next end month date.
 *
 * @function getEndOfNextMonth
 * @returns {Moment}
 */
const getEndOfNextMonth = (): Moment => moment().add(1, "month").endOf("month");

/**
 * Helper function to generate a date range.
 *
 * @function getMonthDateRange
 * @param date
 * @returns {object} The startOfMonth and endOfMonth
 */
const getMonthDateRange = (
  date?: Date | string
): { startOfMonth: Moment; endOfMonth: Moment } => {
  const startOfMonth = moment(date).startOf("month");
  const endOfMonth = moment(date).endOf("month");

  return { startOfMonth, endOfMonth };
};

/**
 * Helper function to get a Date of current year.
 *
 * @function getNextYear
 * @returns {Moment}
 */
const getNextYear = (): Moment => moment().add(1, "year").endOf("year");

/**
 * Helper function to generate a service date.
 *
 * @function createServiceDate
 * @param time - string ex: ```12:00 pm```
 * @param day - string ex: ```1st```
 * @param month - string ex: ```January```
 * @returns {Date} formatted date ```January 1st 2021 @ 12:00 pm```
 */
const createServiceDate = (time: string, day: string, month: string): Date => {
  const year =
    month === "January"
      ? moment().add(1, "month").format(fullyearFormat)
      : moment().format(fullyearFormat);

  return createDate(
    `${month} ${day} ${year} @ ${time}`,
    serviceDateTimeFormat
  ).toDate();
};

/**
 * Helper function to get a start month date from now.
 *
 * @function getStartOfMonth
 * @returns {Moment}
 */
const getStartOfMonth = (): Moment => moment().startOf("month");

/**
 * Helper function to create a next start month date.
 *
 * @function getStartOfNextMonth
 * @returns {string}
 */
const getStartOfNextMonth = (): Moment =>
  moment().add(1, "month").startOf("month");

/**
 * Helper function to get a start month Date 2 months from now.
 *
 * @function getStartOfNextNextMonth
 * @returns {Moment}
 */
const getStartOfNextNextMonth = (): Moment =>
  moment().add(2, "months").startOf("month");

/**
 * Helper function to group objects into a sorted array of events by email.
 *
 * @function groupByEmail
 * @param data - array of events
 * @returns {object}
 */
const groupByEmail = (data: Array<TEventMemberSchedule>): TEventsSorted =>
  data
    .reduce((acc, currentValue) => {
      if (!acc.some(email => email === currentValue.email))
        acc.push(currentValue.email);

      return acc;
    }, [] as Array<string>)
    .map(email => ({
      email,
      events: data.filter(event => event.email === email)
    }));

/**
 * Strips text with ANSI to plain text.
 *
 */
const stripText = (text: string): string =>
  text.trim().replace(/\u001b\[.*?m/g, "");

/**
 * Transforms UPPERCASE text to Capital case.
 *
 * @example ```EXAMPLE => Example```
 */
const toCapitalize = (text: string): string =>
  text.replace(
    /(\w)(\w*)/g,
    (_, firstChar, rest) => firstChar + rest.toLowerCase()
  );

export {
  checkIfDatePassed,
  createDate,
  createServiceDate,
  createSchedule,
  endOfDay,
  endOfTomorrow,
  getCurrentYear,
  getEndOfMonth,
  getEndOfNextMonth,
  getMonthDateRange,
  getNextYear,
  getStartOfMonth,
  getStartOfNextMonth,
  getStartOfNextNextMonth,
  groupByEmail,
  stripText,
  toCapitalize
};
