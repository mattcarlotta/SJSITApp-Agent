import mailer from "@sendgrid/mail";
import config from "env";
import "database";

mailer.setApiKey(config.sendgridAPIKey);
