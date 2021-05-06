import isEmpty from "lodash.isempty";
import { createDate } from "~helpers";
import { serviceDateTimeFormat, timestampFormat } from "~utils/dateFormats";
import type { TAggEvents } from "~types";

/**
 * An HTML template for master staff schedule emails.
 *
 * @function MasterSchedule
 * @param events - Array of events
 * @param startMonth - string
 * @param endMonth - string
 * @returns {string} - HTML email template
 */
const MasterSchedule = (
  events: Array<TAggEvents>,
  startMonth: string,
  endMonth: string
): string => `
  <h1 style="text-align: center;font-size: 26px;color: #eeeeee;margin: 0;padding: 10px 0;background: #0d6472;">
    Upcoming Employee Schedule
  </h1>
  <p style="font-size: 18px;text-align: center;margin: 0;padding-bottom: 10px;color: #eeeeee;background: #0d6472;">
    ${startMonth} - ${endMonth}
  </p>
  ${events
    .map(
      ({
        eventType,
        eventDate,
        location,
        notes,
        opponent,
        team,
        uniform,
        schedule
      }) => `<ul style="border: 1px solid #9e9e9e;background-color: #ebebeb;color: #000000;list-style-type: none;margin: 0;overflow: auto;font-size: 16px;padding: 10px 10px 15px 10px;">
        <li style="color: #000000;margin: 5px 0px;">
          <span style="margin-right: 5px;">
            <strong>Event Type</strong>:&nbsp;${eventType}
          </span>
        </li>
        <li style="color: #000000;margin: 5px 0px;">
          <span style="margin-right: 5px;">
            <strong>Event</strong>:&nbsp;${team}${
        opponent && `<span> vs.&nbsp;${opponent} </span>`
      }
          </span>
        </li>
        <li style="color: #000000;margin: 5px 0px;">
          <span style="margin-right: 5px;">
            <strong>Event Date</strong>:&nbsp;${createDate(eventDate).format(
              serviceDateTimeFormat
            )}
          </span>
        </li>
        <li style="color: #000000;margin: 5px 0px;">
          <span style="margin-right: 5px;">
            <strong>Event Location:</strong>&nbsp;${location}
          </span>
        </li>
        <li style="color: #000000;margin: 5px 0px;">
          <span style="margin-right: 5px;">
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
        <li style="color: #000000;margin: 5px 0px;">
          <span style="margin-right: 5px;">
            <strong>Scheduled Employees</strong>
          </span>
          ${schedule
            .map(
              ({
                _id,
                employeeIds
              }) => `<ul style="list-style-type: none;margin: 0px;padding: 0px;">
                  <span style="padding-left: 10px;">${createDate(_id).format(
                    timestampFormat
                  )}</span>
                  <li style="margin-left: 15px;padding-left: 10px;font-weight: normal;">
                    ${
                      !isEmpty(employeeIds)
                        ? employeeIds
                            .map(
                              ({
                                firstName,
                                lastName
                              }) => `<div style="margin-left: 15px;padding-left: 10px;color: #000000;font-weight: normal;">
                              <span style="margin-right: 5px;">⚬</span>
                              <span>${firstName} ${lastName}</span>  
                            </div>`
                            )
                            .join("")
                        : `<div style="margin-left: 15px;padding-left: 10px;color: rgba(0, 0, 0, 0.65);font-weight: normal;">
                          <span style="margin-right: 5px;">⚬ &#40;none&#41;</span>
                        </div>`
                    }
                  </li>
                </ul>`
            )
            .join("")}
        </li>
      </ul>`
    )
    .join("")}
`;

export default MasterSchedule;
