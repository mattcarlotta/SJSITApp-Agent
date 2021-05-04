import mailer from "@sendgrid/mail";
import { errorMessage, infoMessage } from "../loggers";

const { SENDGRIDAPIKEY } = process.env;

mailer.setApiKey(SENDGRIDAPIKEY as string);

process.on("exit", () => infoMessage("Email service has been stopped."));

// catches ctrl+c event
process.on("SIGINT", () =>
  infoMessage("Email service was manully terminated.")
);

// catches uncaught exceptions
process.on("uncaughtException", e =>
  errorMessage(`Email service has been stopped due to an error: ${e.stack}.`)
);
