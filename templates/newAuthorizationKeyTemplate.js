export default (CLIENT, token, expiration) => `
  <html>
    <body>
      <div style="overflow: hidden;">
        <div style="width: 100%; background-color: #FDFDFD; border-collapse: separate !important; border-spacing: 0">
          <div style="font-size: 16px; padding: 30px; vertical-align: top; display: block; width: 675px; max-width: 675px; margin: 0 auto;">
            <div style="margin-bottom: 30px; margin-top: 15px;">
              <p style="color: #2E323B;">
                <img style="margin-right:15px;" src="https://i.imgur.com/pcu86US.png" height="30px" alt="saplogo.png"></img>
                <img style="margin-right:15px;" src="https://i.imgur.com/Clo9cbt.png" height="40px" alt="sharkslogo.png"></img>
                <img src="https://i.imgur.com/HTcARsE.png" height="33px" alt="barracudaLogo.png"></img>
              </p>
            </div>
            <div style="background-color: #FFFFFF; border: 1px solid #f0f0f0;">
              <div style="font-size: 16px; padding: 30px; vertical-align: top; display: block;">
                <h1 style="margin: 0; text-align: center; font-size: 40px; color: #006d75;">
                  Congratulations!
                </h1>
                <h2 style="margin-bottom: 30px; font-size: 20px; text-align: center; color: #006d75;">
                  You have been selected to join the San Jose Sharks Ice Team!
                </h2>
                <p style="font-size: 16px; color: #000000;">
                  To register, please click the <strong>button below</strong>, or you may visit <a href="${CLIENT}/employee/signup">San Jose Sharks Ice Team Registration</a> and sign up with this Authorization Key:
                </p>
                <p style="font-size:16px; margin-bottom:30px; color:#000000; padding:5px; border: 1px solid #9E9E9E; background: #ebebeb; text-align: center;">
                  <strong>
                    ${token}
                  </strong>
                </p>
                <p style="font-size: 16px; color: #000000;">
                  Please note, that you will have until <strong>${expiration}</strong> end of day to register before the authorization key expires. If the key expires, you must contact the staff supervisor to issue a new one.
                </p>
                <p style="font-size: 16px; margin-bottom: 30px; color: #000000;">
                  Thank you,
                  <br />
                  <span style="font-style: italic;">The San Jose Sharks Ice Team</span>
                </p>
                <div style="margin-bottom: 20px; text-align: center">
                  <a style="font-size: 18px; text-decoration: none; line-height: 40px; width: 200px; color: #FFFFFF; background-color: #006d75; display: inline-block;" href="${CLIENT}/employee/signup/verify?token=${token}">Sign Up</a>
                </div>
                <small style="color: #999999; font-size: 11px; text-align: center">
                  Or click on this link:
                  <a style="color: #999999; text-decoration: underline; margin-left: 4px;" href="${CLIENT}/employee/signup/verify?token=${token}">${CLIENT}/employee/signup/verify?token=${token}</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
