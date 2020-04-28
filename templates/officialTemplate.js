export default (IMAGEAPI, message) => `<html>
    <body>
      <div style="overflow: hidden;">
        <div style="width: 100%; background-color: #FDFDFD; border-collapse: separate !important; border-spacing: 0">
          <div style="font-size: 16px; padding: 30px; vertical-align: top; display: block; max-width: 675px; margin: 0 auto;">
            <div style="margin-bottom: 30px; margin-top: 15px;">
              <p style="color: #2E323B;">
                <img style="margin-right:15px;" title="sapLogo" src="${IMAGEAPI}/images/sapLogo.jpg" height="30px" alt="sapLogo.jpg"></img>
                <img style="margin-right:15px;" title="sharksLogo" src="${IMAGEAPI}/images/sharksLogo.jpg" height="40px" alt="sharksLogo.jpg"></img>
                <img title="barracudaLogo" src="${IMAGEAPI}/images/barracudaLogo.jpg" height="33px" alt="barracudaLogo.jpg"></img>
              </p>
            </div>
            <div style="background-color: #FFFFFF; border: 1px solid #f0f0f0;">
              <div style="font-size: 16px; padding: 30px; vertical-align: top; display: block;">
                ${message}
                <div style="color:#000;font-size:11px;text-align:left;margin-top: 10px;">
                  This email is sent from the <a href="https://sjsiceteam.com">San Jose Sharks Ice Team</a> in association with <a href="http://www.sapcenter.com">SAP Center at San Jose</a>. If you wish to unsubscribe from these emails, change <a href="https://sjsiceteam.com/employee/settings">your email settings</a> or contact the <a href="mailto:sjsitstaff@gmail.com">San Jose Sharks Ice Team Staff</a> for additional help.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>`;
