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
const convertDateToISO = date =>
  moment(date)
    .utcOffset(-7)
    .toISOString(true);

/**
 * Helper function to create a current date.
 *
 * @function
 * @returns {Date}
 */
const endOfDay = () =>
  moment()
    .endOf("day")
    .toDate();

/**
 * Helper function to create a current date.
 *
 * @function
 * @returns {Date}
 */
const startOfDay = () =>
  moment()
    .startOf("day")
    .toDate();

export { convertDateToISO, createDate, endOfDay, startOfDay };
