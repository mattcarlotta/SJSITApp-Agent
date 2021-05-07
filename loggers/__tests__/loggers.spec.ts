/* eslint-disable import/first */
jest.dontMock("~loggers");

import { errorMessage, infoMessage, warnMessage } from "~loggers";
import { stripText } from "~helpers";

const mockLog = jest.fn();

global.console = { ...global.console, log: mockLog };

const getConsoleMessage = (): string => stripText(mockLog.mock.calls[0][0]);

describe("Loggers", () => {
  afterEach(() => {
    mockLog.mockClear();
  });

  it("logs an error message to the console", () => {
    errorMessage("Example error.");

    expect(getConsoleMessage()).toContain("ERROR  Example error.");
  });

  it("logs an info message to the console", () => {
    infoMessage("Example message.");

    expect(getConsoleMessage()).toContain("INFO  Example message.");
  });

  it("logs a warning message to the console", () => {
    warnMessage("Example warning.");

    expect(getConsoleMessage()).toContain("WARN  Example warning.");
  });
});
