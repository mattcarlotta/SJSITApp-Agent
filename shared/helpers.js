import moment from "moment";

/**
 * Helper function to create a current date.
 *
 * @function
 * @returns {Date}
 */
const createDate = date => moment(date || Date.now());

/**
 * Helper function to convert a Date to an ISO Date.
 *
 * @function
 * @returns {Date}
 */
const convertDateToISO = date => moment(date)
  .utcOffset(-7)
  .toISOString(true);

/**
 * Helper function to create a current date.
 *
 * @function
 * @returns {Date}
 */
const endOfDay = () => moment()
  .endOf("day")
  .toDate();

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
  endOfDay,
  getMonthDateRange,
  groupByEmail,
  startOfDay,
};
