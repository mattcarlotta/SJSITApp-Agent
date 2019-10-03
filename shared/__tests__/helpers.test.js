import moment from "moment";
import { User } from "models";
import {
  clearSession,
  convertDateToISO,
  createColumnSchedule,
  createRandomToken,
  createSignupToken,
  createUniqueName,
  createUserSchedule,
  currentDate,
  sendError,
} from "shared/helpers";

describe("Helpers", () => {
  let db;
  beforeAll(() => {
    db = connectDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  it("clears the session", () => {
    const mockResponse = () => {
      const res = {};
      res.clearCookie = jest.fn().mockReturnValue(res);
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res;
    };

    const res = mockResponse();

    clearSession(res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.clearCookie).toHaveBeenCalledWith("SJSITApp", { path: "/" });
    expect(res.json).toHaveBeenCalledWith({ role: "guest" });
  });

  it("builds a column for scheduling", async () => {
    const admin = await User.findOne({ role: "admin" });
    const staff = await User.findOne({ role: "staff" });

    const members = [
      {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
      { _id: staff._id, firstName: staff.firstName, lastName: staff.lastName },
    ];

    const callTimeId = "2019-08-09T17:45:26-07:00";

    const event = {
      schedule: [
        {
          _id: callTimeId,
          employeeIds: [staff._id],
        },
      ],
      scheduledIds: [staff._id],
    };

    const column = createColumnSchedule({ event, members });

    expect(column).toEqual([
      {
        _id: "employees",
        title: "Employees",
        employeeIds: [admin._id],
      },
      {
        _id: callTimeId,
        title: moment(callTimeId).format("hh:mm a"),
        employeeIds: [staff._id],
      },
    ]);
  });

  it("builds a users response array for scheduling", async () => {
    const admin = await User.findOne({ role: "admin" });
    const staff = await User.findOne({ role: "staff" });

    const members = [
      {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
      { _id: staff._id, firstName: staff.firstName, lastName: staff.lastName },
    ];

    const event = {
      employeeResponses: [
        {
          _id: admin._id,
          response: "I want to work.",
          notes: "",
        },
      ],
    };

    const users = createUserSchedule({ event, members });

    expect(users).toEqual([
      {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        response: "I want to work.",
        notes: "",
      },
      {
        _id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        response: "No response.",
        notes: "",
      },
    ]);
  });

  it("returns a Date with a PST time zone", () => {
    const date = new Date(2019, 3, 21);
    const isoDate = convertDateToISO(date);
    expect(isoDate).toEqual("2019-04-21T00:00:00.000-07:00");
  });

  it("creates a random 64 character string", () => {
    const token = createRandomToken();
    expect(token).toEqual(expect.any(String));
    expect(token.length).toEqual(64);
  });

  it("creates a random 32 character string", () => {
    const signupToken = createSignupToken();
    expect(signupToken).toEqual(expect.any(String));
    expect(signupToken.length).toEqual(32);
  });

  it("creates a unique snake-cased template string", () => {
    const template = createUniqueName("Employee Newsletter");
    expect(template).toEqual("employee-newsletter");
  });

  it("creates a current Date string", () => {
    expect(currentDate()).toEqual(expect.any(String));
  });

  it("sends an error to the client", () => {
    const res = mockResponse();
    const err = "Invalid request.";

    sendError(err, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err });
  });
});
