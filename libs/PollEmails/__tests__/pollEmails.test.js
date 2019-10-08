import mailer from "@sendgrid/mail";
import { pollEmails } from "libs";
import { mailLogger } from "loggers";
import { Mail } from "models";
import { endOfDay, startOfDay } from "shared/helpers";
import { officialTemplate } from "templates";

describe("Poll Email Service", () => {
  let db;
  beforeAll(() => {
    db = connectDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  it("handles polling Mail documents", async () => {
    const mailingservice = mailer.send
      .mockImplementationOnce(props => Promise.resolve(props))
      .mockImplementationOnce(() => Promise.reject(new Error("Unauthorized")));

    const startDay = startOfDay();
    const endDay = endOfDay();

    const emails = await Mail.aggregate([
      {
        $match: {
          sendDate: {
            $gte: startDay,
            $lte: endDay,
          },
          status: "unsent",
        },
      },
      { $sort: { sendDate: -1 } },
    ]);

    await pollEmails();

    const goodEmail = await Mail.findOne({ subject: "Testing" });
    expect(goodEmail.status).toEqual("sent");

    expect(mailingservice).toHaveBeenCalledWith({
      to: [...goodEmail.sendTo],
      from: goodEmail.sendFrom,
      subject: goodEmail.subject,
      html: officialTemplate(goodEmail.message),
    });

    const badEmail = await Mail.findOne({ subject: "Testing 2" });
    expect(badEmail.status).toEqual("failed - Unauthorized");
    expect(console.log).toHaveBeenCalledWith(mailLogger(emails));
  });
});
