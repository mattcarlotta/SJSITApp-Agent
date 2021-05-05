import { TEmailProps } from "~types";

const { CLIENT } = process.env;

/**
 * An HTML template for AP Form notification emails.
 *
 * @function APFormNotification
 * @param _id - string
 * @param expirationDate - string
 * @param endMonth - string
 * @param startMonth - string
 * @param notes - string
 * @returns {string} - HTML email template
 */
const APFormNotification = ({
  _id,
  expirationDate,
  endMonth,
  startMonth,
  notes
}: TEmailProps): string => `<h1 style="text-align: center;font-size: 26px;color: #eeeeee;margin: 0;padding: 10px 0;background: linear-gradient(90deg, #1f1f23 0%, #145e6b 50%, #1f1f23 100%);">
    A/P Form Notification
  </h1>
  <p style="font-size: 18px;text-align: center;margin: 0;padding-bottom: 10px;color: #eeeeee;background: linear-gradient(90deg, #1f1f23 0%, #145e6b 50%, #1f1f23 100%);">
    A new A/P form has been created for ${startMonth} - ${endMonth}.
  </p>
  <p style="font-size: 16px;text-align: start;background-color: #ffffff;color: rgb(0, 0, 0);">
    To view the A/P form, please click the <strong>button below</strong> or you may view the A/P form by navigating to the <a href="${CLIENT}/employee/dashboard" rel="noopener noreferrer" target="_blank">Dashboard</a> page, locating the <strong>Forms</strong> tab and clicking on the <strong>View</strong> button.
  </p>
  ${
    notes &&
    `<p style="font-size: 16px;text-align: start;background-color: #ffffff;color: rgb(0, 0, 0);">
      <strong>Form Notes</strong>:
      <i>
        ${notes}
      </i>
    </p>`
  }
  <p style="font-size: 16px;text-align: start;background-color: #ffffff;color: rgb(0, 0, 0);">
    Please note that you will have until <strong style="color: red;">${expirationDate}</strong> to submit and/or edit your availability. After the expiration date, the A/P form will no longer be accessible.
  </p>
  <div style="background-color:#ffffff;text-align:center;">
    <a style="color: #ffffff;font-size: 18px;text-decoration: none;line-height: 40px;width: 200px;background: linear-gradient(90deg,#194048 0%,#0f7888 50%,#194048 100%);border-radius: 4px;display: inline-block;border: 2px solid #04515d;" href="${CLIENT}/employee/forms/view/${_id}" target="_blank" rel="noopener noreferrer">
      View A/P Form
    </a>
  </div>
  <div style="color:#999999;font-size:11px;text-align:center;margin-top: 10px;">
    Or click on this link:
    <a style="color: #999999; text-decoration: underline; margin-left: 2px;" href="${CLIENT}/employee/forms/view/${_id}" target="_blank" rel="noopener noreferrer">${CLIENT}/employee/forms/view/${_id}</a>
  </div>
`;

export default APFormNotification;
