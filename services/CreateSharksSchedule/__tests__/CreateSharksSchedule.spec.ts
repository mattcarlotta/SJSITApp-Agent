import mongoose from "mongoose";
import { connectToDB } from "~database";
import { createSharksSchedule } from "~services";
import { errorMessage, infoMessage } from "~loggers";
import { Event } from "~models";
import { getEndOfMonth, getStartOfNextNextMonth } from "~helpers";
import { eventFormat } from "~utils/dateFormats";
import mockAxios from "~utils/mockAxios";
import data from "./fakedata";

const eventSpy = jest.spyOn(Event, "insertMany");

describe("Create Sharks Schedule Service", () => {
  let startMonth: string;
  let endMonth: string;
  beforeAll(async () => {
    await connectToDB();
    startMonth = getStartOfNextNextMonth().format(eventFormat);
    endMonth = getEndOfMonth(startMonth).format(eventFormat);
  });

  beforeEach(() => {
    mockAxios.reset();
  });

  afterEach(() => {
    eventSpy.mockClear();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    eventSpy.mockRestore();
  });

  it("handles unsuccessful polling NHL API", async () => {
    mockAxios
      .onGet(`schedule?teamId=28&startDate=${startMonth}&endDate=${endMonth}`, {
        data: {}
      })
      .reply(200);

    await createSharksSchedule();

    expect(eventSpy).toHaveBeenCalledTimes(0);

    expect(errorMessage).toHaveBeenCalledWith(
      "No Sharks home events were found."
    );
  });

  it("handles successful polling NHL API", async () => {
    mockAxios
      .onGet(`schedule?teamId=28&startDate=${startMonth}&endDate=${endMonth}`)
      .reply(200, data);

    await createSharksSchedule();

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: expect.any(String),
          location: expect.any(String),
          callTimes: expect.any(Array),
          eventDate: expect.any(String),
          opponent: expect.any(String),
          schedule: expect.arrayContaining([
            expect.objectContaining({
              _id: expect.any(String),
              employeeIds: expect.any(Array)
            })
          ]),
          seasonId: expect.any(String),
          team: expect.any(String),
          notes: expect.any(String)
        })
      ])
    );

    expect(infoMessage).toHaveBeenCalledWith(`Processed Sharks Events... 1`);
  });
});
