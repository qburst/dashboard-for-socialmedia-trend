import { createSlice } from "@reduxjs/toolkit";

import api from "../utils/api";

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
  console.log(search);
  try {
    dispatch(getHashtagsStart());

    const response = await api.get("/userHashtags", { params: { search } });

    dispatch(getHashtagsSuccess({ data: response.results }));
  } catch (e) {
    console.log(e);
    // no op
  }
};
