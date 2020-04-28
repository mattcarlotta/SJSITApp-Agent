import { pollNHLAPI } from "~libs";
import { errorLogger, eventLogger, formCountLogger } from "~loggers";
import { Event, Form } from "~models";
import { getEndOfMonth, getStartOfNextNextMonth } from "~shared/helpers";
import data from "../__mocks__/libs.mocks";

const format = "YYYY-MM-DD";

const eventSpy = jest.spyOn(Event, "insertMany");
const formSpy = jest.spyOn(Form, "create");

describe("Poll NHL API Service", () => {
  let db;
  let startMonth;
  let endMonth;
  beforeAll(() => {
    db = connectDatabase();
    startMonth = getStartOfNextNextMonth().format(format);
    endMonth = getEndOfMonth(startMonth).format(format);
  });

  beforeEach(() => {
    mockAxios.reset();
  });

  afterEach(() => {
    eventSpy.mockClear();
    formSpy.mockClear();
  });

  afterAll(async () => {
    await db.close();
    eventSpy.mockRestore();
    formSpy.mockRestore();
    mockAxios.restore();
  });

  it("handles unsuccessful polling NHL API", async () => {
    mockAxios
      .onGet(`schedule?teamId=28&startDate=${startMonth}&endDate=${endMonth}`, {
        data: {}
      })
      .reply(200);

    await pollNHLAPI();

    expect(eventSpy).toHaveBeenCalledTimes(0);
    expect(formSpy).toHaveBeenCalledTimes(0);

    expect(console.log.mock.calls[0]).toContain(
      errorLogger("Unable to retrieve next month's game schedule.")
    );
  });

  it("handles successful polling NHL API", async () => {
    mockAxios
      .onGet(`schedule?teamId=28&startDate=${startMonth}&endDate=${endMonth}`)
      .reply(200, data);

    await pollNHLAPI();

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
              employeeIds: expect.any(Array),
              title: expect.any(String)
            })
          ]),
          seasonId: expect.any(String),
          team: expect.any(String),
          notes: expect.any(String)
        })
      ])
    );

    expect(formSpy).toHaveBeenCalledTimes(1);
    expect(formSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        seasonId: expect.any(String),
        startMonth: expect.any(String),
        endMonth: expect.any(String),
        expirationDate: expect.any(String),
        sendEmailNotificationsDate: expect.any(String),
        notes: expect.any(String)
      })
    );

    expect(console.log.mock.calls[0]).toContain(eventLogger([1]));
    expect(console.log.mock.calls[1]).toContain(formCountLogger(1));
  });
});
