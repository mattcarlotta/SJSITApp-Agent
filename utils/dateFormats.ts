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
 * Formats moment dates as 1 hour digts: 1
 */
export const shortHourFormat = "h";

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
 * Formats moment dates with abbreviated weekday: TUE
 */
export const shortdayFormat = "DDD";

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
 * Formats moment dates as 3 digits months, followed by day and time: Apr 21st @ 12:00 pm.
 */
export const shortDateTimeFormat = `${shortmonthFormat} @ ${timestampFormat}`;

/**
 * Formats moment dates as 3 digits months, followed by day, 4 digit year, and time: Apr 21st 2020 @ 12:00pm.
 */
export const dateTimeFormat = `${shortmonthFormat} ${fullyearFormat} @ ${timestampFormat}`;

/**
 * Formats moment dates as month names followed by 2 digit day with suffix and time.
 *
 * @example ```April 21st @ 12:00pm```
 */
export const serviceTimeFormat = `${monthnameFormat}-${daySuffix} @ ${timestampFormat}`;

/**
 * Formats moment dates as 3 digits months, followed by day, 4 digit year, and time.
 *
 * @example ```Apr 21st 2020 @ 12:00:00 pm.```
 */
export const fullDateTimeFormat = `${shortmonthFormat} ${fullyearFormat} @ ${hourFormat}:${minuteFormat}:${secondsFormat} ${aFormat}`;

/**
 * Formats moment dates as month name, followed by day, year and time.
 *
 * `MMMM D YYYY h:mma`
 * @example ```April 21 2021 1:00pm```.
 */
export const barracudaEventFormat = `${monthnameFormat} ${dayFormat} ${fullyearFormat} ${shortHourFormat}:${minuteFormat}${aFormat}`;

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
 * Formats moment dates with 4 digit year, 2 digit month and 2 digit day : 2021-03-01
 */
export const eventFormat = `${fullyearFormat}-${monthdateFormat}-${fulldayFormat}`;
