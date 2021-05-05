/* eslint-disable no-control-regex */
/* eslint-disable import/first */
jest.dontMock("~loggers");

import { errorMessage, infoMessage, warnMessage } from "~loggers";

const mockLog = jest.fn();

global.console = { ...global.console, log: mockLog };

const stripAndTrimConsoleMessage = (): string =>
  mockLog.mock.calls[0][0].trim().replace(/\u001b\[.*?m/g, "");

describe("Loggers", () => {
  afterEach(() => {
    mockLog.mockClear();
  });

  it("logs an error message to the console", () => {
    errorMessage("Example error.");

    expect(stripAndTrimConsoleMessage()).toEqual(" ERROR  Example error.");
  });

  it("logs an info message to the console", () => {
    infoMessage("Example message.");

    expect(stripAndTrimConsoleMessage()).toEqual(" INFO  Example message.");
  });

  it("logs a warning message to the console", () => {
    warnMessage("Example warning.");

    expect(stripAndTrimConsoleMessage()).toEqual(" WARN  Example warning.");
  });
});
