import mongoose from "mongoose";
import mailer from "@sendgrid/mail";
import { connectToDB } from "~database";
import { pollEmails } from "~services";
import { infoMessage } from "~loggers";
import { Mail } from "~models";
import type { TMailDocument } from "~types";

const mailService = mailer.send as jest.Mock;

mailService.mockImplementationOnce(props => Promise.resolve(props));

mailService.mockImplementationOnce(() =>
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
    await pollEmails();

    const sentEmail = await Mail.find({ status: "sent" }).limit(1);

    expect(sentEmail).toBeTruthy();

    expect(mailService).toHaveBeenCalledWith({
      to: expect.any(Array),
      from: expect.any(String),
      subject: expect.any(String),
      html: expect.any(String)
    });

    const failedEmail = (await Mail.findOne({
      status: { $regex: "failed", $options: "i" }
    })) as TMailDocument;

    expect(failedEmail.status).toEqual("failed - Unauthorized");
    expect(infoMessage).toHaveBeenCalledTimes(1);
  });
});
