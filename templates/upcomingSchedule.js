export default ({
  events,
}) => `<h1 style="text-align: center;font-size: 40px;color: #eeeeee;margin: 0;background-color: #025f6d">
    Upcoming Schedule
  </h1>
  <p style="font-size: 18px;text-align: center;margin: 0;padding: 0 10px 10px;color: #eeeeee;background-color: #025f6d;">
    You&#39;re scheduled to work the following events:
  </p>
  ${events
    .map(
      ({
        callTime,
        eventType,
        eventDate,
        location,
        notes,
        opponent,
        team,
        uniform,
      }) => `<ul style="border: 1px solid #9e9e9e;background-color: #ebebeb;color: #000000;list-style: none;margin: 0;overflow: auto;font-size: 16px;padding: 10px 10px 15px 10px;">
      <li style="color: #000000;margin: 5px 0px;">
        <span style="margin-right: 5px;">
          <strong>Event Type</strong>:&nbsp;${eventType}
        </span>
      </li>
      <li style="color: #000000;margin: 5px 0px;">
        <span style="margin-right: 5px;">
          <strong>Event</strong>:&nbsp;${team}${opponent
        && `<span>
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
      ${notes
        && `<li style="color: #000000;margin: 5px 0px;">
          <span style="margin-right: 5px;">
            <strong>Event Notes</strong>:&nbsp;${notes}
          </span>
        </li>`}
    </ul>`,
    )
    .join("")}
`;
