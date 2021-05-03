jest.mock("node-schedule");
jest.mock("@sendgrid/mail");

global.console = { ...global.console, log: jest.fn() };
