import { createSlice } from "@reduxjs/toolkit";

import api from "../utils/api";

const initialState = {
  data: {},
  loading: false,
  error: null,
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
      state.error = null;
    },
    getCountFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getCountStart,
  getCountSuccess,
  getCountFailure,
} = count.actions;
export default count.reducer;

export const fetchCount = () => async (
  dispatch
) => {
  try {
    dispatch(getCountStart());
    const response = await api.get("/world");

    dispatch(
      getCountSuccess({ data: { ...response.data, date: response.created_at } })
    );
  } catch (err) {
    dispatch(getCountFailure(err));
  }
};
