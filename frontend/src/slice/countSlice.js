import { createSlice } from "@reduxjs/toolkit";

import fetch from "../utils/fetch";

const initialState = {
  data: {},
  loading: false,
};

const count = createSlice({
  name: "counts",
  initialState,
  reducers: {
    getCountStart(state) {
      state.loading = true;
      state.error = null;
    },
    getCountSuccess(state, action) {
      state.data = action.payload.data;
      state.loading = false;
    }
  },
});

export const {
  getCountStart,
  getCountSuccess,
} = count.actions;
export default count.reducer;

export const fetchCount = () => async (dispatch) => {
  try {
    dispatch(getCountStart());

    const response = await fetch("/report/world/");

    dispatch(
      getCountSuccess({ data: { ...response.data, date: response.created_at } })
    );
  } catch (error) {
    // no op
  }
};
