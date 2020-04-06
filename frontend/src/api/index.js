import axios from "axios";

export default axios.create({
  baseURL: "http://api.covid-dashboard.qburst.build/",
  timeout: 5000,
});
