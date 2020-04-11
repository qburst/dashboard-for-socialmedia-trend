import zlFetch from "zl-fetch";

import withBase from "../withBase";

const fetch = (path, options) =>
  new Promise((resolve, reject) => {
    zlFetch(withBase(path), options)
      .then((data) => resolve(data.body))
      .catch((data) => reject(data.body));
  });

export default fetch;
