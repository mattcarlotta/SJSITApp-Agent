export default ({ _id, CLIENT, expirationDate, endMonth, startMonth }) =>
  `<h1 style="background-color: #006d75;margin: 0px;text-align:center;font-size: 40px;color: #ffffff;">
    A/P Form Notification
  </h1>
  <h2 style="background-color: #ffffff;font-size: 20px;text-align: center;color: #006d75;">
    A new A/P form has been created for ${startMonth} - ${endMonth}.
  </h2>
  <p style="font-size: 16px;text-align: start;background-color: #ffffff;color: rgb(0, 0, 0);">
    To view the A/P form, please click the <strong>button below</strong> or you may view the A/P form by navigating to <a href="${CLIENT}/employee/forms/viewall" rel="noopener noreferrer" target="_blank">View Forms</a> and locating form id#: <strong>${_id}</strong>.
  </p>
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
