import mongoose from "mongoose";
import mailer from "@sendgrid/mail";
import { connectToDB } from "~database";
import { pollEmails } from "~libs";
import { mailLogger } from "~loggers";
import { Mail } from "~models";
import { endOfDay } from "~helpers";

mailer.send.mockImplementationOnce(props => Promise.resolve(props));
mailer.send.mockImplementationOnce(() =>
  Promise.reject(new Error("Unauthorized"))
);

describe("Poll Email Service", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("handles polling Mail documents", async () => {
    const endDay = endOfDay();

    const emails = await Mail.aggregate([
      {
        $match: {
          sendDate: {
            $lte: endDay
          },
          status: "unsent"
        }
      },
      { $sort: { sendDate: -1 } }
    ]);

    await pollEmails();

    const sentEmail = await Mail.find({ status: "sent" }).limit(1);
    expect(sentEmail).toBeTruthy();

    expect(mailer.send.mock.calls[0]).toContainEqual({
      to: expect.any(Array),
      from: expect.any(String),
      subject: expect.any(String),
      html: expect.any(String)
    });

    const failedEmail = await Mail.findOne({
      status: { $regex: "failed", $options: "i" }
    });
    expect(failedEmail.status).toEqual("failed - Unauthorized");
    expect(console.log.mock.calls[0]).toContain(mailLogger(emails));
  });
});
