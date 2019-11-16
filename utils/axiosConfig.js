/* istanbul ignore file */
import get from "lodash/get";
import axios from "axios";

const nhlAPI = axios.create({
  baseURL: "https://statsapi.web.nhl.com/api/v1/",
});

nhlAPI.interceptors.response.use(
  response => response,
  error => {
    const err = get(error, ["response", "data", "err"]);

    return Promise.reject(err || error.message);
  },
);

export default nhlAPI;
