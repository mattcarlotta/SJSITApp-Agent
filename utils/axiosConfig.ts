/* istanbul ignore file */
import axios from "axios";

const nhlAPI = axios.create({
  baseURL: "https://statsapi.web.nhl.com/api/v1/"
});

export const ahlAPI = axios.create({
  baseURL: "http://www.sjbarracuda.com/"
});

export default nhlAPI;
