import { createSlice } from "@reduxjs/toolkit";

import api from "../utils/api";

const initialState = {
  data: {},
  loading: false,
};

const categories = createSlice({
  name: "categories",
  initialState,
  reducers: {
    getCategoriesStart(state) {
      state.loading = true;
      state.error = null;
    },
    getCategoriesSuccess(state, action) {
      state.data = action.payload.data;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { getCategoriesStart, getCategoriesSuccess } = categories.actions;
export default categories.reducer;

export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch(getCategoriesStart());

    const response = await api.get("/categories");

    dispatch(getCategoriesSuccess({ data: response.results }));
  } catch ({ error }) {
    // no op
  }
};
