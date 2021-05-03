/* istanbul ignore file */
import get from "lodash.get";
import axios from "axios";

const nhlAPI = axios.create({
  baseURL: "https://statsapi.web.nhl.com/api/v1/"
});

nhlAPI.interceptors.response.use(
  response => response,
  error =>
    Promise.reject(get(error, ["response", "data", "err"] || error.message))
);

export const ahlAPI = axios.create({
  baseURL: "http://www.sjbarracuda.com/"
});

ahlAPI.interceptors.response.use(
  response => response,
  error =>
    Promise.reject(get(error, ["response", "data", "err"] || error.message))
);

export default nhlAPI;
