import { createSlice } from "@reduxjs/toolkit";

import fetch from "../utils/fetch";
import { showToaster } from "./toasterSlice";

const initialState = {
  count: 0,
  chosenTweet: null,
  data: [],
  loading: false,
};

const tweets = createSlice({
  name: "tweets",
  initialState,
  reducers: {
    getTweetsStart(state, action) {
      if (action.payload.replace) state.data = [];

      state.loading = true;
    },
    getTweetsSuccess(state, action) {
      const { data, count, replace } = action.payload;

      state.count = count;
      state.data = replace ? data : [...state.data, ...data];
      state.loading = false;
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
  page = 1,
  category,
  country,
  hashtags,
} = {}) => async (dispatch) => {
  try {
    dispatch(getTweetsStart({ replace: page === 1 }));

    const queries = { page };

    if (category) queries.category = category;
    if (country) queries.country = country;
    if (hashtags) queries.hashtags = hashtags;

    const response = await fetch("/tweets/", {
      queries,
    });

    dispatch(
      getTweetsSuccess({
        data: response.results,
        count: response.count,
        replace: page === 1,
      })
    );
    dispatch(showToaster({ message: response.results.length ? "Tweets loaded successfully" : "There are no tweets" }));
  } catch (error) {
    dispatch(getTweetsFailure({ error }));
    dispatch(
      showToaster({ message: "Unable to load tweets. Please try again." })
    );
  }
};

export const reportTweet = ({ id }) => async (dispatch, getState) => {
  try {
    dispatch(getTweetsStart({ replace: false }));

    const token = getState().session.token;
    const queries = {
      tweet_id: id,
    };

    await fetch("/add_spam_count/", {
      method: 'put',
      headers: { Authorization: `Token ${token}` },
      queries,
    });

    dispatch(getReportTweetSuccess({ id }));
    dispatch(showToaster({ message: "Tweet reported successfully" }));
  } catch (err) {
    dispatch(getTweetsFailure(err));
    dispatch(
      showToaster({ message: "Unable to report tweet. Please try again." })
    );
  }
};
