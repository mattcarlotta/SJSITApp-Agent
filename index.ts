import mailer from "@sendgrid/mail";
import { scheduleJob } from "node-schedule";
import { connectToDB } from "~database";
import { errorMessage } from "~loggers";
import runServices from "~lib";

const { NODE_ENV, SENDGRIDAPIKEY } = process.env;

mailer.setApiKey(SENDGRIDAPIKEY as string);

const pollSeconds = NODE_ENV === "development" ? "*/5" : "*/30";

(async (): Promise<void> => {
  try {
    await connectToDB();
    scheduleJob(`${pollSeconds} * * * * *`, () => runServices());
  } catch (err: any) {
    errorMessage(err.toString());
  }
})();
