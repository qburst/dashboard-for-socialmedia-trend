const BASE_URL = "https://api.covid-dashboard.qburst.build";

const withBase = (path) => {
  if (path.includes("users")) return BASE_URL + path;

  return BASE_URL + "/api" + path;
};

export default withBase;