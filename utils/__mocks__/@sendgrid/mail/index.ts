import mailer from "@sendgrid/mail";

jest.mock("@sendgrid/mail", () => ({
  __esModule: true,
  send: jest.fn(),
  default: {
    send: jest.fn()
  }
}));

export default mailer;
