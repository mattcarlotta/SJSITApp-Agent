import { connectDatabase } from "database";
import { Types } from "mongoose";

jest.mock("node-schedule");

global.console = { ...global.console, log: jest.fn() };
global.ObjectId = Types.ObjectId;
global.connectDatabase = connectDatabase;
