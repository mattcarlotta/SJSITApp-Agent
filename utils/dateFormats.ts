/**
 * Formats moment dates as am or pm.
 *
 * Format - ```a```
 * @example ```am```
 */
export const aFormat = "a";

/**
 * Formats moment dates as 2 second digits.
 *
 * Format - ```ss```
 * @example ```01```
 */
export const secondsFormat = "ss";

/**
 * Formats moment dates as 2 minute digits.
 *
 * Format - ```mm```
 * @example ```01```
 */
export const minuteFormat = "mm";

/**
 * Formats moment dates as 2 hour digits.
 *
 * Format - ```hh```
 * @example ```01```
 */
export const hourFormat = "hh";

/**
 * Formats moment dates as 1 hour digit.
 *
 * Format - ```h```
 * @example ```1```
 */
export const shortHourFormat = "h";

/**
 * Formats moment dates as hour, minute and seconds with am/pm.
 *
 * Format - ```hh:mm a```
 * @example ```12:00 pm```
 */
export const timestampFormat = `${hourFormat}:${minuteFormat} ${aFormat}`;

/**
 * Formats moment dates as 1 or 2 day digit.
 *
 * Format - ```D```
 * @example ```1``` or ```10```
 */
export const dayFormat = "D";

/**
 * Formats moment dates as 1 day digits by suffix (st/nd/rd/th).
 *
 * Format - ```Do```
 * @example ```1st```
 */
export const daySuffix = "Do";

/**
 * Formats moment dates as 2 digits
 *
 * Format - ```DD```
 * @example ```01```
 */
export const fulldayFormat = "DD";

/**
 * Formats year dates as 4 digits.
 *
 * Format - ```YYYY```
 * @example ```2021```
 */
export const fullyearFormat = "YYYY";

/**
 * Formats month dates as 2 digits.
 *
 * Format - ```MM```
 * @example ```01```
 */
export const monthdateFormat = "MM";

/**
 * Formats month dates as string months.
 *
 * Format - ```MMM```
 * @example ```Jan```
 */
export const shortMonthNameFormat = "MMM";

/**
 * Formats month dates as string months.
 *
 * Format - ```MMMM```
 * @example ```January```
 */
export const monthnameFormat = "MMMM";

/**
 * Formats moment dates as abbreviated 3 digits months followed by day.
 *
 * Format - ```MMM Do```
 * @example ```Jan 1st```
 */
export const shortmonthFormat = `${shortMonthNameFormat} ${daySuffix}`;

/**
 * Formats moment dates as full month name, followed by day and suffix, 4 digit year and time.
 *
 * Format - ```MMMM Do YYYY @ hh:mm a```
 * @example ```January 1st 2021 @ 12:00 pm```
 */
export const serviceDateTimeFormat = `${monthnameFormat} ${daySuffix} ${fullyearFormat} @ ${timestampFormat}`;

/**
 * Formats moment dates as 3 digits months, followed by day + suffix, 4 digit year, and time.
 *
 * Format - ```MMM Do YYYY @ hh:mm a```
 * @example ```Jan 21st 2021 @ 12:00pm```
 */
export const dateTimeFormat = `${shortmonthFormat} ${fullyearFormat} @ ${timestampFormat}`;

/**
 * Formats moment dates as 3 digits months, followed by day, 4 digit year, and time.
 *
 * Format - ```MMM Do YYYY @ hh:mm:ss a```
 * @example ```Jan 1st 2020 @ 12:00:00 pm.```
 */
export const fullDateTimeFormat = `${shortmonthFormat} ${fullyearFormat} @ ${hourFormat}:${minuteFormat}:${secondsFormat} ${aFormat}`;

/**
 * Formats moment dates as month name, followed by day, year and time.
 *
 * Format - ```MMMM D YYYY h:mma```
 * @example ```January 1 2021 12:00pm```
 */
export const barracudaEventFormat = `${monthnameFormat} ${dayFormat} ${fullyearFormat} ${shortHourFormat}:${minuteFormat}${aFormat}`;

/**
 * Formats moment dates as month, followed by day, and 4 digit year.
 *
 * Format - ```MMMM Do YYYY```
 * @example ```January 1st 2021```
 */
export const calendarDateFormat = `${monthnameFormat} ${daySuffix} ${fullyearFormat}`;

/**
 * Formats moment dates with 4 digit year, 2 digit month and 2 digit day.
 *
 * Format - ```YYYY-MM-DD```
 * @example ```2021-01-01```
 */
export const eventFormat = `${fullyearFormat}-${monthdateFormat}-${fulldayFormat}`;

/**
 * Default moment formated dates:
 *
 * Format - ```YYYY-MM-DDTHH:mm:ssZ```
 * @example ```2021-01-01T00:00:00Z```
 */
export const defaultFormat = `${eventFormat}THH:mm:ssZ`;
