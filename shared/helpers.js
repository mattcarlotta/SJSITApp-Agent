import moment from "moment-timezone";

/**
 * Helper function to create a current date.
 *
 * @function createDate
 * @returns {Date}
 */
const createDate = date => moment(date || Date.now());

/**
 * Helper function to convert a Date to an ISO Date.
 *
 * @function convertDateToISO
 * @returns {Date}
 */
const convertDateToISO = date => moment(date)
  .utcOffset(-7)
  .toISOString(true);

/**
 * Helper function to generate a schedule based upon calltimes.
 *
 * @function createSchedule
 * @param callTimes - an array of dates
 * @returns {object}
 */
const createSchedule = callTimes => callTimes.map(time => ({
  _id: time,
  title: moment(time).format("hh:mm a"),
  employeeIds: [],
}));

/**
 * Helper function to create a current date.
 *
 * @function endOfDay
 * @returns {Date}
 */
const endOfDay = () => moment()
  .endOf("day")
  .toDate();

/**
 * Helper function to create a current date.
 *
 * @function endOfTomorrow
 * @returns {Date}
 */
const endOfTomorrow = () => moment()
  .add(1, "day")
  .endOf("day")
  .toDate();

/**
 * Helper function to get a Date of current year.
 *
 * @function getCurrentYear
 * @returns {Date}
 */
const getCurrentYear = () => moment().startOf("year");

/**
 * Helper function to get a end month date.
 *
 * @function getEndOfMonth
 * @returns {Date}
 */
const getEndOfMonth = date => moment(date).endOf("month");

/**
 * Helper function to create a next end month date.
 *
 * @function getEndOfNextMonth
 * @returns {Date}
 */
const getEndOfNextMonth = () => moment()
  .add(1, "month")
  .endOf("month")
  .format();

/**
 * Helper function to generate a date range.
 *
 * @function getMonthDateRange
 * @param date
 * @returns {object}
 */
const getMonthDateRange = date => {
  const newDate = date || Date.now();
  const startOfMonth = moment(newDate)
    .startOf("month")
    .toDate();
  const endOfMonth = moment(newDate)
    .endOf("month")
    .toDate();

  return { startOfMonth, endOfMonth };
};

/**
 * Helper function to get a Date of current year.
 *
 * @function getNextYear
 * @returns {Date}
 */
const getNextYear = () => moment()
  .add(1, "year")
  .endOf("year");

/**
 * Helper function to get a start month date from now.
 *
 * @function getStartOfMonth
 * @returns {Date}
 */
const getStartOfMonth = () => moment().startOf("month");

/**
 * Helper function to create a next start month date.
 *
 * @function getStartOfNextMonth
 * @returns {Date}
 */
const getStartOfNextMonth = () => moment()
  .add(1, "months")
  .startOf("month")
  .format();

/**
 * Helper function to get a start month Date 2 months from now.
 *
 * @function getStartOfNextNextMonth
 * @returns {Date}
 */
const getStartOfNextNextMonth = () => moment()
  .add(2, "months")
  .startOf("month");

/**
 * Helper function to group objects into a sorted array of events by email.
 *
 * @function groupByEmail
 * @param data - array of events
 * @returns {object}
 */
const groupByEmail = data => data
  .reduce((acc, currentValue) => {
    if (!acc.some(email => email === currentValue.email)) acc.push(currentValue.email);

    return acc;
  }, [])
  .map(email => ({
    email,
    events: data.filter(event => event.email === email),
  }));

/**
 * Helper function to create a current date.
 *
 * @function
 * @returns {Date}
 */
const startOfDay = () => moment()
  .startOf("day")
  .toDate();

export {
  convertDateToISO,
  createDate,
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
  startOfDay,
};
