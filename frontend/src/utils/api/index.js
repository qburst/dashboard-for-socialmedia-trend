import axios from "axios";

const instance = axios.create({
  baseURL: "http://api.covid-dashboard.qburst.build/api",
  timeout: 5000
});

instance.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

export default instance;