export default ({
  callTime,
  eventType,
  eventDate,
  location,
  notes,
  opponent,
  team,
  uniform,
}) =>
  `<h1 style="text-align:center;font-size:40px;color: rgb(255, 255, 255);margin:0;background: #0d747c;">
    Event Reminder
  </h1>
  <p style="font-size: 18px;text-align:center;color: rgb(0, 0, 0.65);">
    You're scheduled to work an upcoming event:
  </p>
  <ul style="border: 1px solid #9e9e9e;background: #ebebeb;color: #000000;list-style:none;overflow:auto;font-size: 16px;padding-left: 10px;">
    <li style="color: #000000;margin: 5px 0px;">
      <span style="margin-right: 5px;">
        <strong>Event Type</strong>:&nbsp;${eventType}
      </span>
    </li>
    <li style="color: #000000;margin: 5px 0px;">
      <span style="margin-right: 5px;">
        <strong>Event</strong>:&nbsp;${team}${opponent &&
    `<span>
      vs.&nbsp;${opponent}
    </span>`}
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
    ${notes &&
      `<li style="color: #000000;margin: 5px 0px;">
        <span style="margin-right: 5px;">
          <strong>Event Notes</strong>:&nbsp;${notes}
        </span>
      </li>`}
  </ul>
`;
