import { createSlice } from "@reduxjs/toolkit";

import fetch from "../utils/fetch";

const initialState = {
  data: [],
  loading: false,
};

const categories = createSlice({
  name: "categories",
  initialState,
  reducers: {
    getCategoriesStart(state) {
      state.loading = true;
    },
    getCategoriesSuccess(state, action) {
      state.data = action.payload.data;
      state.loading = false;
    },
  },
});

export const { getCategoriesStart, getCategoriesSuccess } = categories.actions;
export default categories.reducer;

export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch(getCategoriesStart());

    const response = await fetch("/categories/");

    dispatch(getCategoriesSuccess({ data: response.results }));
  } catch (error) {
    // no op
  }
};
