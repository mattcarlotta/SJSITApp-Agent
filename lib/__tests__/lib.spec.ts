/* eslint-disable import/first */
// const mockCreateAPForm = jest.fn(() => Promise.resolve());
// const mockCreateBarracudaSchedule = jest.fn(() => Promise.resolve());
// const mockCreateSharksSchedule = jest.fn(() => Promise.resolve());
// const mockGenerateFormReminders = jest.fn(() => Promise.resolve());
// const mockGenerateMemberSchedules = jest.fn(() => Promise.resolve());
// const mockGenerateStaffSchedule = jest.fn(() => Promise.resolve());
// const mockPollEmails = jest.fn(() => Promise.resolve());
// const mockPollEvents = jest.fn(() => Promise.resolve());
// const mockPollForms = jest.fn(() => Promise.resolve());

// jest.mock("~services", () => ({
//   __esModule: true,
//   createAPForm: mockCreateAPForm,
//   createBarracudaSchedule: mockCreateBarracudaSchedule,
//   createSharksSchedule: mockCreateSharksSchedule,
//   generateFormReminders: mockGenerateFormReminders,
//   generateMemberSchedules: mockGenerateMemberSchedules,
//   generateStaffSchedule: mockGenerateStaffSchedule,
//   pollEmails: mockPollEmails,
//   pollEvents: mockPollEvents,
//   pollForms: mockPollForms
// }));

import mongoose from "mongoose";
import moment from "moment";
import { connectToDB } from "~database";
import { getStartOfNextMonth, stripText } from "~helpers";
import { errorMessage, infoMessage, warnMessage } from "~loggers";
import runServices from "~lib";
import { Service } from "~models";
import { monthnameFormat } from "~utils/dateFormats";
import { IServiceDocument } from "~types";
import {
  createAPForm,
  createBarracudaSchedule,
  createSharksSchedule,
  generateFormReminders,
  generateMemberSchedules,
  generateStaffSchedule,
  pollEmails,
  pollEvents,
  pollForms
} from "~services";

jest.mock("~services", () => ({
  __esModule: true,
  createAPForm: jest.fn(() => Promise.resolve()),
  createBarracudaSchedule: jest.fn(() => Promise.resolve()),
  createSharksSchedule: jest.fn(() => Promise.resolve()),
  generateFormReminders: jest.fn(() => Promise.resolve()),
  generateMemberSchedules: jest.fn(() => Promise.resolve()),
  generateStaffSchedule: jest.fn(() => Promise.resolve()),
  pollEmails: jest.fn(() => Promise.resolve()),
  pollEvents: jest.fn(() => Promise.resolve()),
  pollForms: jest.fn(() => Promise.resolve())
}));

jest.mock("~loggers", () => ({
  __esModule: true,
  errorMessage: jest.fn(),
  infoMessage: jest.fn(),
  warnMessage: jest.fn()
}));

const mockErrorMessage = errorMessage as jest.Mock;
const mockInfoMessage = infoMessage as jest.Mock;
const mockWarnMessage = warnMessage as jest.Mock;

const mockPollEmails = pollEmails as jest.Mock;
const mockPollEvents = pollEvents as jest.Mock;
const mockPollForms = pollForms as jest.Mock;
const mockCreateSharksSchedule = createSharksSchedule as jest.Mock;
const mockCreateBarracudaSchedule = createBarracudaSchedule as jest.Mock;
const mockCreateAPForm = createAPForm as jest.Mock;
const mockGenerateFormReminders = generateFormReminders as jest.Mock;
const mockGenerateMemberSchedules = generateMemberSchedules as jest.Mock;
const mockGenerateStaffSchedule = generateStaffSchedule as jest.Mock;
const createServiceSpy = jest.spyOn(Service, "findOne");

// const currentMonth = getStartOfMonth().format(monthnameFormat);
let prevMonth = moment().subtract(1, "month").format(monthnameFormat);
prevMonth = prevMonth === "December" ? "January" : prevMonth;
const nextMonth = getStartOfNextMonth().format(monthnameFormat);

describe("Run Services", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  afterEach(() => {
    mockErrorMessage.mockClear();
    mockInfoMessage.mockClear();
    mockWarnMessage.mockClear();
    createServiceSpy.mockClear();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    createServiceSpy.mockRestore();
  });

  it("initially displays a warning about services not being created", async () => {
    await runServices();

    expect(createServiceSpy).toHaveBeenCalledTimes(1);
    expect(stripText(mockErrorMessage.mock.calls[0][0])).toContain(
      "The services haven't been initialized yet."
    );
  });

  describe("When services are created", () => {
    let service: IServiceDocument;
    beforeAll(async () => {
      service = await Service.create({
        automatedOnline: false,
        emailOnline: false,
        eventOnline: false,
        eventDay: "1st",
        eventMonth: nextMonth,
        eventTime: "01:00 am",
        formReminderOnline: false,
        formReminderDay: "1st",
        formReminderMonth: nextMonth,
        formReminderTime: "01:00 am",
        scheduleOnline: false,
        scheduleDay: "1st",
        scheduleMonth: nextMonth,
        scheduleTime: "01:00 am"
      });
    });

    it("should display warnings that automated and email services are deactivated", async () => {
      await runServices();

      expect(stripText(mockWarnMessage.mock.calls[0][0])).toContain(
        "All automated services are deactivated."
      );
      expect(stripText(mockWarnMessage.mock.calls[1][0])).toContain(
        "Email services are deactivated."
      );
    });

    it("should run the email services", async () => {
      await service.updateOne({
        emailOnline: true
      });
      await runServices();

      expect(mockPollForms).toHaveBeenCalledTimes(1);
      expect(mockPollEvents).toHaveBeenCalledTimes(1);
      expect(mockPollEmails).toHaveBeenCalledTimes(1);
    });

    it("displays that all individual automated services are currently deactivated", async () => {
      await service.updateOne({
        automatedOnline: true
      });
      await runServices();

      expect(stripText(mockWarnMessage.mock.calls[0][0])).toContain(
        "The event creation service is deactivated."
      );

      expect(stripText(mockWarnMessage.mock.calls[1][0])).toContain(
        "The AP form reminders service is deactivated."
      );

      expect(stripText(mockWarnMessage.mock.calls[2][0])).toContain(
        "The schedule creation service is deactivated."
      );
    });

    it("runs the event service but the date hasn't passed yet", async () => {
      await service.updateOne({
        eventOnline: true
      });

      await runServices();

      expect(stripText(mockWarnMessage.mock.calls[0][0])).toContain(
        "The event creation service date hasn't passed yet."
      );
    });

    it("runs the event service when the date has passed and updates the month", async () => {
      await service.updateOne({
        eventMonth: prevMonth
      });

      await runServices();

      expect(mockCreateSharksSchedule).toHaveBeenCalledTimes(1);
      expect(mockCreateBarracudaSchedule).toHaveBeenCalledTimes(1);
      expect(mockCreateAPForm).toHaveBeenCalledTimes(1);
    });

    it("runs the form reminder service but the date hasn't passed yet", async () => {
      await service.updateOne({
        formReminderOnline: true
      });
      await runServices();

      expect(stripText(mockWarnMessage.mock.calls[1][0])).toContain(
        "The AP form reminders service date hasn't passed yet."
      );
    });

    it("runs the form reminder service when the date has passed and updates the month", async () => {
      await service.updateOne({
        formReminderMonth: prevMonth
      });

      await runServices();

      expect(mockGenerateFormReminders).toHaveBeenCalledTimes(1);
    });

    it("runs the schedule service but the date hasn't passed yet", async () => {
      await service.updateOne({
        scheduleOnline: true
      });
      await runServices();

      expect(stripText(mockWarnMessage.mock.calls[2][0])).toContain(
        "The schedule creation service date hasn't passed yet."
      );
    });

    it("runs the schedule service when the date has passed and updates the month", async () => {
      await service.updateOne({
        scheduleMonth: prevMonth
      });

      await runServices();

      expect(mockGenerateMemberSchedules).toHaveBeenCalledTimes(1);
      expect(mockGenerateStaffSchedule).toHaveBeenCalledTimes(1);
    });
  });
});
