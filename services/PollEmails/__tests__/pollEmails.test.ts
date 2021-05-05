import mongoose from "mongoose";
import { connectToDB } from "~database";
import { pollEmails } from "~services";
import { infoMessage } from "~loggers";
import { Mail } from "~models";
import { endOfDay } from "~helpers";
import type { TMailDocument } from "~types";

const mockSend = jest.fn();

jest.mock("@sendgrid/mail", () => ({
  __esModule: true,
  default: {
    send: mockSend
  }
}));

mockSend.mockImplementationOnce(props => Promise.resolve(props));
mockSend.mockImplementationOnce(() =>
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

    expect(mockSend).toHaveBeenCalledWith({
      to: expect.any(Array),
      from: expect.any(String),
      subject: expect.any(String),
      html: expect.any(String)
    });

    const failedEmail = (await Mail.findOne({
      status: { $regex: "failed", $options: "i" }
    })) as TMailDocument;

    expect(failedEmail.status).toEqual("failed - Unauthorized");
    expect(infoMessage).toContain(`Processed Mail... ${emails.length}`);
  });
});
