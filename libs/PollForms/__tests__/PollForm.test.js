import { pollForms } from "libs";
import { formLogger } from "loggers";
import { Form, Mail, User } from "models";
import { createDate, endOfDay, startOfDay } from "shared/helpers";
import { apFormNotification } from "templates";

const { CLIENT } = process.env;

describe("Poll Forms Service", () => {
  let db;
  beforeAll(() => {
    db = connectDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  it("handles polling Form documents", async () => {
    const mailSpy = jest.spyOn(Mail, "insertMany");
    const startDay = startOfDay();
    const endDay = endOfDay();

    const forms = await Form.find(
      {
        sendEmailNotificationsDate: {
          $gte: startDay,
          $lte: endDay,
        },
        sentEmails: false,
      },
      {
        startMonth: 1,
        endMonth: 1,
        expirationDate: 1,
        notes: 1,
      },
      { sort: { startMonth: 1 } },
    ).lean();

    await pollForms();

    const members = await User.aggregate([
      { $match: { role: { $ne: "admin" } } },
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
          subject: `Sharks & Barracuda A/P Form (${startOfMonth} - ${endOfMonth})`,
          message: apFormNotification({
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

    const updatedForm = await Form.findOne({ _id });
    expect(updatedForm.sentEmails).toBeTruthy();

    expect(console.log).toHaveBeenCalledWith(formLogger([1]));
  });
});
