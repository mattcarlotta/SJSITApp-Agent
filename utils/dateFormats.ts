/**
 * Formats moment dates as am or pm
 */
export const aFormat = "a";

/**
 * Formats moment dates as 2 second digits: 01
 */
export const secondsFormat = "ss";

/**
 * Formats moment dates as 2 minute digts: 01
 */
export const minuteFormat = "mm";

/**
 * Formats moment dates as 2 hour digts: 01
 */
export const hourFormat = "hh";

/**
 * Formats moment dates as hour, minute and seconds with am/pm: 01:00 pm
 */
export const timestampFormat = `${hourFormat}:${minuteFormat} ${aFormat}`;

/**
 * Formats moment dates as 1 day digits: 1
 */
export const dayFormat = "D";

/**
 * Formats moment dates as 1 day digits by suffix (st/nd/rd/th): 1st
 */
export const daySuffix = "Do";

/**
 * Formats moment dates as 2 digits: 01
 */
export const fulldayFormat = "DD";

/**
 * Formats moment dates with abbreviated weekday: Tue
 */
export const weekdayFormat = "ddd";

/**
 * Formats moment dates with weekday: Tuesday
 */
export const fullweekdayFormat = "dddd";

/**
 * Formats year dates as 4 digits: 2020.
 */
export const fullyearFormat = "YYYY";

/**
 * Formats month dates as 2 digits: 04.
 */
export const monthdateFormat = "MM";

/**
 * Formats month dates as string months: Apr.
 */
export const shortMonthNameFormat = "MMM";

/**
 * Formats month dates as string months: April.
 */
export const monthnameFormat = "MMMM";

/**
 * Formats moment dates as abbreviated 3 digits months followed by day: Apr 21st
 */
export const shortmonthFormat = `${shortMonthNameFormat} ${daySuffix}`;

/**
 * Formats moment dates as 3 digits months, followed by day and time: April 21st @ 12:00pm.
 */
export const shortDateTimeFormat = `${shortmonthFormat} @ ${timestampFormat}`;

/**
 * Formats moment dates as 3 digits months, followed by day, 4 digit year, and time: April 21st 2020 @ 12:00pm.
 */
export const dateTimeFormat = `${shortmonthFormat} ${fullyearFormat} @ ${timestampFormat}`;

/**
 * Formats moment dates as 3 digits months, followed by day, 4 digit year, and time: April 21st 2020 @ 12:00:00 pm.
 */
export const fullDateTimeFormat = `${shortmonthFormat} ${fullyearFormat} @ ${hourFormat}:${minuteFormat}:${secondsFormat} ${aFormat}`;

("MMMM Do YYYY @ h:mm:ssa");

/**
 * Formats moment dates as 3 digit weekday, month name, followed by day, and time: Sat, April 21st @ 12:00pm.
 */
export const weekdateTimeFormat = `${weekdayFormat}, ${monthnameFormat} ${daySuffix} @ ${timestampFormat}`;

/**
 * Formats moment dates as month, followed by day, and 4 digit year: April 21st 2020.
 */
export const calendarDateFormat = `${monthnameFormat} ${daySuffix} ${fullyearFormat}`;

/**
 * Formats moment dates as month, followed by day, and 4 digit year: Apr 21st, 2020.
 */
export const shortCalendarDateFormat = `${shortMonthNameFormat} ${daySuffix}, ${fullyearFormat}`;

/**
 * Default moment formated dates: 2021-03-01T00:00:00Z
 */
export const defaultFormat = `${fullyearFormat}-${monthdateFormat}-${fulldayFormat}THH:mm:ssZ`;

/**
 * Formats moment dates with 2 digit month, 2 digit day, followed by 4 digit year : 03-01-2021
 */
export const standardFormat = `${monthdateFormat}-${fulldayFormat}-${fullyearFormat}`;

/**
 * Formats moment dates with 4 digit year, 2 digit month and 2 digit day : 2021-03-01
 */
export const eventFormat = `${fullyearFormat}-${monthdateFormat}-${fulldayFormat}`;

/**
 * Formats moment dates with 4 digit year, 2 digit month and 2 digit day : 01-03-2021
 */
export const eventReverseFormat = `${monthdateFormat}-${fulldayFormat}-${fullyearFormat}`;

/**
 * Formats moment dates with 4 digit year and 2 digit month: 2021 03
 */
export const simpleFormat = `${monthnameFormat} ${fullyearFormat}`;

/**
 * Formats moment dates with 4 digit year and 2 digit month: 2021-03
 */
export const yearMonthFormat = `${fullyearFormat}-${monthnameFormat}`;
