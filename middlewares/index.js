import mailer from "@sendgrid/mail";
import config from "env";
import "database";

const { NODE_ENV } = process.env;

mailer.setApiKey(config.sendgridAPIKey);
