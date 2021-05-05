import { errorMessage, infoMessage, warnMessage } from "~loggers";

jest.mock("~loggers", () => ({
  __esModule: true,
  errorMessage: jest.fn(),
  infoMessage: jest.fn(),
  warnMessage: jest.fn()
}));

export { errorMessage, infoMessage, warnMessage };
