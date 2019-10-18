import mailer from "@sendgrid/mail";
import { pollEmails } from "libs";
import { mailLogger } from "loggers";
import { Mail } from "models";
import { endOfDay, startOfDay } from "shared/helpers";

jest.mock("@sendgrid/mail");
mailer.send.mockImplementationOnce(props => Promise.resolve(props));
mailer.send.mockImplementationOnce(() => Promise.reject(new Error("Unauthorized")));

describe("Poll Email Service", () => {
  let db;
  beforeAll(() => {
    db = connectDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  it("handles polling Mail documents", async () => {
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

    expect(mailer.send.mock.calls[0]).toContainEqual({
      to: expect.any(Array),
      from: expect.any(String),
      subject: expect.any(String),
      html: expect.any(String),
    });

    const badEmail = await Mail.findOne({
      status: { $regex: "failed", $options: "i" },
    });
    expect(badEmail.status).toEqual("failed - Unauthorized");
    expect(console.log.mock.calls[0]).toContain(mailLogger(emails));
  });
});
