import MockAdapter from "axios-mock-adapter";
import nhlAPI, { ahlAPI } from "~utils/axiosConfig";

const mockNHLAPI = new MockAdapter(nhlAPI);

export const mockAHLAPI = new MockAdapter(ahlAPI)

export default mockNHLAPI;
