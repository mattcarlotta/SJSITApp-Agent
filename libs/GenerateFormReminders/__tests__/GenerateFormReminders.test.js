import moment from "moment-timezone";
import { generateFormReminders } from "libs";
import { formLogger } from "loggers";
import { Form, Mail, User } from "models";
import { createDate, getEndOfMonth } from "shared/helpers";
import { apFormReminder } from "templates";

const { CLIENT } = process.env;

describe("Generate A/P Form Reminders Service", () => {
  let db;
  beforeAll(() => {
    db = connectDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  it("handles polling Form documents for reminders", async () => {
    const mailSpy = jest.spyOn(Mail, "create");
    const startNextMonth = moment()
      .add(1, "months")
      .startOf("month")
      .format();

    const endNextMonth = getEndOfMonth(startNextMonth);

    const forms = await Form.find(
      {
        startMonth: { $gte: startNextMonth },
        endMonth: { $lte: endNextMonth },
      },
      {
        startMonth: 1,
        endMonth: 1,
        expirationDate: 1,
        notes: 1,
      },
      { sort: { startMonth: 1 } },
    ).lean();

    await generateFormReminders();

    const members = await User.aggregate([
      {
        $match: {
          role: { $eq: "employee" },
          status: "active",
          emailReminders: true,
        },
      },
      { $sort: { lastName: 1 } },
      {
        $project: {
          id: 1,
          email: {
            $concat: ["$firstName", " ", "$lastName", " ", "<", "$email", ">"],
          },
        },
      },
    ]);

    const memberEmails = members.map(({ email }) => email);

    const {
      _id, endMonth, expirationDate, startMonth, notes,
    } = forms[0];
    const format = "MM/DD/YYYY";
    const endOfMonth = createDate(endMonth).format(format);
    const startOfMonth = createDate(startMonth).format(format);

    expect(mailSpy).toHaveBeenCalledTimes(1);
    expect(mailSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sendTo: memberEmails,
          sendFrom: "San Jose Sharks Ice Team <noreply@sjsiceteam.com>",
          subject: `Sharks & Barracuda A/P Form Reminder (${startOfMonth} - ${endOfMonth})`,
          message: apFormReminder({
            _id,
            CLIENT,
            expirationDate: createDate(expirationDate).format(
              "MMMM Do YYYY @ hh:mm a",
            ),
            endMonth: endOfMonth,
            startMonth: startOfMonth,
            notes,
          }),
        }),
      ]),
    );

    expect(console.log).toHaveBeenCalledWith(formLogger([1]));
  });
});
