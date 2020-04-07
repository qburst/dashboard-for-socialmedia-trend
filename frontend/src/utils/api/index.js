import axios from "axios";

const instance = axios.create({
  baseURL: "http://api.covid-dashboard.qburst.build",
  timeout: 5000,
});

instance.interceptors.request.use(
  function (config) {
    if (!config.url.includes("users")) {
      config.url = "/api" + config.url;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
