import moment from "moment-timezone";
import mailer from "@sendgrid/mail";
import { logErrorMessage, logInfoMessage } from "../logger";

const { sendgridAPIKey } = process.env;

moment.tz.setDefault("America/Los_Angeles");

mailer.setApiKey(sendgridAPIKey as string);

process.on("exit", () => logInfoMessage("Email service has been stopped."));

// catches ctrl+c event
process.on("SIGINT", () =>
  logInfoMessage("Email service was manully terminated.")
);

// catches uncaught exceptions
process.on("uncaughtException", e =>
  logErrorMessage(`Email service has been stopped due to an error: ${e.stack}.`)
);