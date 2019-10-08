import { connectDatabase } from "database";
import { Types } from "mongoose";

jest.mock("node-schedule");
jest.mock("@sendgrid/mail");

global.console = { log: jest.fn() };
global.ObjectId = Types.ObjectId;
global.connectDatabase = connectDatabase;
