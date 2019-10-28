export default ({
  _id,
  CLIENT,
  expirationDate,
  endMonth,
  startMonth,
  notes,
}) => `<h1 style="text-align: center;font-size: 40px;color: #eeeeee;margin: 0;background-color: #025f6d;">
    A/P Form Notification
  </h1>
  <p style="font-size: 18px;text-align: center;margin: 0;padding-bottom: 10px;color: #eeeeee;background-color: #025f6d;">
    A new A/P form has been created for ${startMonth} - ${endMonth}.
  </p>
  <p style="font-size: 16px;text-align: start;background-color: #ffffff;color: rgb(0, 0, 0);">
    To view the A/P form, please click the <strong>button below</strong> or you may view the A/P form by navigating to the <a href="${CLIENT}/employee/dashboard" rel="noopener noreferrer" target="_blank">Dashboard</a> page, locating the <strong>Forms</strong> tab and clicking on the <strong>Sharks & Barracuda A/P Form</strong> button.
  </p>
  ${notes
    && `<p style="font-size: 16px;text-align: start;background-color: #ffffff;color: rgb(0, 0, 0);">
      <strong>Form Notes</strong>:
      <i>
        ${notes}
      </i>
    </p>`}
  <p style="font-size: 16px;text-align: start;background-color: #ffffff;color: rgb(0, 0, 0);">
    Please note, that you will have until <strong style="color: red;">${expirationDate}</strong> to submit and/or edit your availability. After the expiration date, the A/P form will no longer be accessible.
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
