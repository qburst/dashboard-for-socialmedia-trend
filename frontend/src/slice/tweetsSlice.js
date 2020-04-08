import { createSlice } from "@reduxjs/toolkit";

import api from "../utils/api";
import { showToaster } from "./toasterSlice";

const initialState = {
  count: 0,
  chosenTweet: null,
  data: [],
  loading: false,
  error: null,
};

const tweets = createSlice({
  name: "tweets",
  initialState,
  reducers: {
    getTweetsStart(state, action) {
      if (action.payload.replace) state.data = [];

      state.loading = true;
      state.error = null;
    },
    getTweetsSuccess(state, action) {
      const { data, count, replace } = action.payload;

      state.count = count;
      state.data = replace ? data : [...state.data, ...data];
      // state.data = [];
      state.loading = false;
      state.error = null;
    },
    getTweetsFailure(state, action) {
      state.loading = false;
      state.error = action.payload.error;
    },
    getReportTweetAdd(state, action) {
      state.chosenTweet = action.payload.chosenTweet;
    },
    getReportTweetRemove(state) {
      state.chosenTweet = null;
    },
    getReportTweetSuccess(state, action) {
      const index = state.data.find((item) => item.id === action.payload.id);

      if (index > -1) state.data.splice(index, 1);
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  getTweetsStart,
  getTweetsSuccess,
  getTweetsFailure,
  getReportTweetAdd,
  getReportTweetRemove,
  getReportTweetSuccess,
} = tweets.actions;
export default tweets.reducer;

export const fetchTweets = ({
  page,
  category,
  country,
  hashtag,
} = {}) => async (dispatch) => {
  try {
    dispatch(getTweetsStart({ replace: page === 1 }));

    const params = { page };

    if (category) params.category = category;
    if (country) params.country = country;
    if (hashtag) params.hashtag = hashtag;

    const response = await api.get("/tweets", {
      params,
    });

    dispatch(
      getTweetsSuccess({
        data: response.results,
        count: response.count,
        replace: page === 1,
      })
    );
    dispatch(showToaster({ message: "Tweets loaded successfully" }));
  } catch ({ error }) {
    dispatch(getTweetsFailure({ error }));
    dispatch(showToaster({ message: `Unable to load tweets for ${category.toLowerCase()}` }));
  }
};

export const reportTweet = ({ id }) => async (dispatch) => {
  try {
    dispatch(getTweetsStart({ replace: false }));

    const token = localStorage.getItem("session.token");

    await api.put(
      `/add_spam_count?tweet_id=${id}`,
      {},
      {
        headers: { Authorization: `Token ${token}` },
      }
    );

    dispatch(getReportTweetSuccess({ id }));
    dispatch(showToaster({ message: "Tweet reported successfully" }));
  } catch (err) {
    dispatch(getTweetsFailure(err));
    dispatch(
      showToaster({ message: "Unable to report tweet. Please try again." })
    );
  }
};
