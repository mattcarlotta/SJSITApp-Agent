import mongoose from "mongoose";
import { connectToDB } from "~database";
import { createBarracudaSchedule } from "~services";
import { errorMessage, infoMessage } from "~loggers";
import { Event } from "~models";
import { mockAHLAPI } from "~utils/mockAxios";
import data from "./fakedata";
import nohomegamesdata from "./nohomegamesdata";

const eventSpy = jest.spyOn(Event, "insertMany");

mockAHLAPI
  .onGet("games")
  .replyOnce(404)
  .onGet("games")
  .replyOnce(200, nohomegamesdata)
  .onGet("games")
  .reply(200, data);

describe("Create Barracuda Schedule Service", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  afterEach(() => {
    eventSpy.mockClear();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    eventSpy.mockRestore();
  });

  it("handles unsuccessful failed requests to Barracuda home page", async () => {
    await createBarracudaSchedule();

    expect(eventSpy).toHaveBeenCalledTimes(0);

    expect(errorMessage).toHaveBeenCalledWith(
      "Error: Request failed with status code 404"
    );
  });

  it("handles successful requests to Barracuda home page without games", async () => {
    await createBarracudaSchedule();

    expect(eventSpy).toHaveBeenCalledTimes(0);

    expect(infoMessage).toHaveBeenCalledWith("Processed Barracuda Events... 0");
  });

  it("handles successful scrapeing Barracuda home page with games", async () => {
    await createBarracudaSchedule();

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
          uniform: expect.any(String),
          seasonId: expect.any(String),
          team: expect.any(String),
          notes: expect.any(String)
        })
      ])
    );

    expect(infoMessage).toHaveBeenCalledWith("Processed Barracuda Events... 2");
  });
});
