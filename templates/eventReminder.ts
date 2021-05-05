import type { TEventReminder } from "~types";

/**
 * An HTML template for Event reminder emails.
 *
 * @function EventReminder
 * @param callTime - string
 * @param eventType - string
 * @param eventDate - string
 * @param location - string
 * @param notes - string;
 * @param opponent - string;
 * @param team - string;
 * @param uniform - string;
 * @returns {string} - HTML email template
 */
const EventReminder = ({
  callTime,
  eventType,
  eventDate,
  location,
  notes,
  opponent,
  team,
  uniform
}: TEventReminder): string => `<h1 style="text-align: center;font-size: 26px;color: #eeeeee;margin: 0;padding: 10px 0;background: linear-gradient(90deg, #1f1f23 0%, #145e6b 50%, #1f1f23 100%);">
    Event Reminder
  </h1>
  <p style="font-size: 18px;text-align: center;margin: 0;padding: 0 10px 10px;color: #eeeeee;background: linear-gradient(90deg, #1f1f23 0%, #145e6b 50%, #1f1f23 100%);">
    You're scheduled to work an upcoming event.
  </p>
  <ul style="border: 1px solid #9e9e9e;background-color: #ebebeb;color: #000000;list-style: none;margin: 0;overflow: auto;font-size: 16px;padding: 10px 10px 15px 10px;">
    <li style="color: #000000;margin: 5px 0px;">
      <span style="margin-right: 5px;">
        <strong>Event Type</strong>:&nbsp;${eventType}
      </span>
    </li>
    <li style="color: #000000;margin: 5px 0px;">
      <span style="margin-right: 5px;">
        <strong>Event</strong>:&nbsp;${team}${
  opponent &&
  `<span>
      vs.&nbsp;${opponent}
    </span>`
}
      </span>
    </li>
    <li style="color: #000000;margin: 5px 0px;">
      <span style="margin-right: 5px;">
        <strong>Event Date</strong>:&nbsp;${eventDate}
      </span>
    </li>
    <li style="color: #000000;margin: 5px 0px;">
      <span style="margin-right: 5px;">
        <strong>Event Location:</strong>&nbsp;${location}
      </span>
    </li>
    <li style="color: #000000;margin: 5px 0px;">
      <span style=";">
        <strong>Call Time</strong>:&nbsp;${callTime}
      </span>
    </li>
    <li style="color: #000000;margin: 5px 0px;">
      <span style=";">
        <strong>Uniform</strong>:&nbsp;${uniform}
      </span>
    </li>
    ${
      notes &&
      `<li style="color: #000000;margin: 5px 0px;">
        <span style="margin-right: 5px;">
          <strong>Event Notes</strong>:&nbsp;${notes}
        </span>
      </li>`
    }
  </ul>
`;

export default EventReminder;
