export default ({
  _id,
  CLIENT,
  expirationDate,
  endMonth,
  startMonth,
}) => `<h1 style="text-align: center;font-size: 26px;color: #eeeeee;margin: 0;padding: 10px 0;background-color: #025f6d;">
    A/P Form Reminder
  </h1>
  <p style="font-size: 18px;text-align: center;margin: 0;padding-bottom: 10px;color: #eeeeee;background-color: #025f6d;">
    Reminder for the ${startMonth} - ${endMonth} A/P form.
  </p>
  <p style="font-size: 16px;text-align: start;background-color: #ffffff;color: rgb(0, 0, 0);">
    This is a friendly reminder that the A/P form is about to expire. If you haven't already filled out the A/P form or if you want to update your availability, please take note that you will have until <strong style="color: red;">${expirationDate}</strong> to submit and/or edit it. After the expiration date, the form will no longer be accessible.
  </p>
  <div style="background-color:#ffffff;text-align:center;">
    <a style="color: #ffffff;font-size: 18px;text-decoration: none;line-height: 40px;width: 200px;background-color: #006d75;display: inline-block;" href="${CLIENT}/employee/forms/view/${_id}" target="_blank" rel="noopener noreferrer">
      View A/P Form
    </a>
  </div>
  <div style="color:#999999;font-size:11px;text-align:center;margin-top: 10px;">
    Or click on this link:
    <a style="color: #999999; text-decoration: underline; margin-left: 2px;" href="${CLIENT}/employee/forms/view/${_id}" target="_blank" rel="noopener noreferrer">${CLIENT}/employee/forms/view/${_id}</a>
  </div>
`;
