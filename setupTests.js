import { connectDatabase } from "database";
import { Types } from "mongoose";
import mockAxios from "utils/__mocks__/mockAxios";

jest.mock("node-schedule");
jest.mock("@sendgrid/mail");

global.console = { ...global.console, log: jest.fn() };
global.ObjectId = Types.ObjectId;
global.connectDatabase = connectDatabase;
global.mockAxios = mockAxios;
