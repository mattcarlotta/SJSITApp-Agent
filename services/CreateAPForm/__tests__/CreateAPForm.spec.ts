import mongoose from "mongoose";
import { connectToDB } from "~database";
import { createAPForm } from "~services";
import { infoMessage } from "~loggers";
import { Form } from "~models";
import {
  createDate,
  getCurrentYear,
  getEndOfMonth,
  getNextYear,
  getStartOfMonth
} from "~helpers";
import mockAxios from "~utils/mockAxios";
import { fullyearFormat } from "~utils/dateFormats";

const formSpy = jest.spyOn(Form, "create");

describe("Create AP Form Service", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  beforeEach(() => {
    mockAxios.reset();
  });

  afterEach(() => {
    formSpy.mockClear();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    formSpy.mockRestore();
  });

  it("creates an AP form", async () => {
    const startMonth = getStartOfMonth();
    const currentYear = getCurrentYear().format(fullyearFormat);
    const nextYear = getNextYear().format(fullyearFormat);
    const endMonth = getEndOfMonth(startMonth.toDate());

    const expirationDate = createDate()
      .add(1, "month")
      .startOf("month")
      .add(6, "days")
      .endOf("day")
      .format();

    await createAPForm();

    expect(formSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        seasonId: `${currentYear}${nextYear}`,
        startMonth: startMonth.format(),
        endMonth: endMonth.format(),
        expirationDate,
        sendEmailNotificationsDate: startMonth.format(),
        notes: expect.any(String)
      })
    );

    expect(infoMessage).toHaveBeenCalledWith("Processed AP Forms... 1");
  });
});
