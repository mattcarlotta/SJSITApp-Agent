export default message => `
  <html>
    <body>
      <div style="overflow: hidden;">
        <div style="width: 100%; background-color: #FDFDFD; border-collapse: separate !important; border-spacing: 0">
          <div style="font-size: 16px; padding: 30px; vertical-align: top; display: block; max-width: 675px; margin: 0 auto;">
            <div style="margin-bottom: 30px; margin-top: 15px;">
              <p style="color: #2E323B;">
                <img style="margin-right:15px;" src="https://i.imgur.com/pcu86US.png" height="30px" alt="saplogo.png"></img>
                <img style="margin-right:15px;" src="https://i.imgur.com/Clo9cbt.png" height="40px" alt="sharkslogo.png"></img>
                <img src="https://i.imgur.com/HTcARsE.png" height="33px" alt="barracudaLogo.png"></img>
              </p>
            </div>
            <div style="background-color: #FFFFFF; border: 1px solid #f0f0f0;">
              <div style="font-size: 16px; padding: 30px; vertical-align: top; display: block;">
                ${message}
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
