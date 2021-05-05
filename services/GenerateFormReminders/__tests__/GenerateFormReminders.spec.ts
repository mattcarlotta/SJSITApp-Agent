import mongoose from "mongoose";
import { connectToDB } from "~database";
import { generateFormReminders } from "~services";
import { infoMessage } from "~loggers";
import { Form, Mail, User } from "~models";
import { createDate, getEndOfMonth } from "~helpers";
import { apFormReminder } from "~templates";
import { dateTimeFormat, calendarDateFormat } from "~utils/dateFormats";

describe("Generate A/P Form Reminders Service", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("handles polling Form documents for reminders", async () => {
    const mailSpy = jest.spyOn(Mail, "create");
    const startNextMonth = createDate().add(1, "months").startOf("month");

    const endNextMonth = getEndOfMonth(startNextMonth.format());

    const forms = await Form.find(
      {
        startMonth: { $gte: startNextMonth.toDate() },
        endMonth: { $lte: endNextMonth.toDate() }
      },
      {
        startMonth: 1,
        endMonth: 1,
        expirationDate: 1,
        notes: 1
      },
      { sort: { startMonth: 1 } }
    ).lean();

    await generateFormReminders();

    const members = await User.aggregate([
      {
        $match: {
          role: { $eq: "member" },
          status: "active",
          emailReminders: true
        }
      },
      { $sort: { lastName: 1 } },
      {
        $project: {
          id: 1,
          email: {
            $concat: ["$firstName", " ", "$lastName", " ", "<", "$email", ">"]
          }
        }
      }
    ]);

    const memberEmails = members.map(({ email }) => email);

    const { _id, endMonth, expirationDate, startMonth, notes } = forms[0];
    const endOfMonth = createDate(endMonth).format(calendarDateFormat);
    const startOfMonth = createDate(startMonth).format(calendarDateFormat);

    expect(mailSpy).toHaveBeenCalledTimes(1);
    expect(mailSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sendTo: memberEmails,
          sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
          subject: `Sharks & Barracuda A/P Form Reminder (${startOfMonth} - ${endOfMonth})`,
          message: apFormReminder({
            _id,
            expirationDate: createDate(expirationDate).format(dateTimeFormat),
            endMonth: endOfMonth,
            startMonth: startOfMonth,
            notes
          })
        })
      ])
    );

    expect(infoMessage).toHaveBeenCalledWith("Processed Form Reminders... 1");
  });
});
