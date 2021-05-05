import mailer from "@sendgrid/mail";
import { scheduleJob } from "node-schedule";
import { connectToDB } from "~database";
import { errorMessage, infoMessage } from "~loggers";
import runServices from "~lib";

const { NODE_ENV, SENDGRIDAPIKEY } = process.env;

mailer.setApiKey(SENDGRIDAPIKEY as string);

const pollRate =
  NODE_ENV === "development" ? "*/5 * * * * *" : "*/30 * * * * *";

/**
 * An IFFE to start up automated services.
 */
(async (): Promise<void> => {
  try {
    await connectToDB();
    scheduleJob(pollRate, () => runServices());
  } catch (err) {
    errorMessage(err.toString());
  }
})();

process.on("exit", () => infoMessage("Email service has been stopped."));

// catches ctrl+c event
process.on("SIGINT", () =>
  infoMessage("Email service was manully terminated.")
);

// catches uncaught exceptions
process.on("uncaughtException", e =>
  errorMessage(`Email service has been stopped due to an error: ${e.stack}.`)
);
