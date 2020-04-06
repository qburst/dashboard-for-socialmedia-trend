import { createSlice } from "@reduxjs/toolkit";

import api from "../utils/api";
import { showToaster } from "../toasterSlice";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const tweets = createSlice({
  name: "tweets",
  initialState,
  reducers: {
    getTweetsStart(state) {
      state.loading = true;
      state.error = null;
    },
    getTweetsSuccess(state, action) {
      const { data } = action.payload;

      state.data = [...state.data, ...data];
      state.loading = false;
      state.error = null;
    },
    getTweetsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
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
  getReportTweetSuccess,
} = tweets.actions;
export default tweets.reducer;

export const fetchTweets = ({ page, category, country, hashtag }) => async (
  dispatch
) => {
  try {
    dispatch(getTweetsStart());
    const params = { page };

    if (category) params.category = category;
    if (country) params.country = country;
    if (hashtag) params.hashtag = hashtag;

    const response = await api.get("/tweets", {
      params,
    });

    dispatch(getTweetsSuccess({ data: response.data }));
    dispatch(showToaster({ message: "Tweets loaded successfully" }));
  } catch (err) {
    dispatch(getTweetsFailure(err));
  }
};

export const reportTweet = ({ tweet_id }) => async (dispatch) => {
  try {
    dispatch(getTweetsStart());

    await api.get("/add_spam_count", {
      tweet_id,
    });

    dispatch(getReportTweetSuccess({ id: tweet_id }));
    dispatch(showToaster({ message: "Tweet reported successfully" }));
  } catch (err) {
    dispatch(getTweetsFailure(err));
    dispatch(
      showToaster({ message: "Unable to report tweet. Please try again." })
    );
  }
};
