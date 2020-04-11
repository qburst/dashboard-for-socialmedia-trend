import { createSlice } from "@reduxjs/toolkit";

import fetch from "../utils/fetch";

const initialState = {
  data: [],
  loading: false,
};

const hashtags = createSlice({
  name: "hashtags",
  initialState,
  reducers: {
    getHashtagsStart(state) {
      state.loading = true;
    },
    getHashtagsSuccess(state, action) {
      state.data = action.payload.data;
      state.loading = false;
    },
  },
});

export const { getHashtagsStart, getHashtagsSuccess } = hashtags.actions;
export default hashtags.reducer;

export const fetchHashtags = ({ search }) => async (dispatch) => {
  try {
    dispatch(getHashtagsStart());

    const queries = { search };
    const response = await fetch("/userHashtags/", {
      queries,
    });

    dispatch(getHashtagsSuccess({ data: response.results }));
  } catch (error) {
    // no op
  }
};
