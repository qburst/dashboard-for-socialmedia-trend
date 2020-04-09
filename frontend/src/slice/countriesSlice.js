import { createSlice } from "@reduxjs/toolkit";

import fetch from "../utils/fetch";
import countryList from "../utils/countries";

const initialState = {
  data: [],
  loading: false,
};

const countries = createSlice({
  name: "countries",
  initialState,
  reducers: {
    getCountriesStart(state) {
      state.loading = true;
    },
    getCountriesSuccess(state, action) {
      state.data = action.payload.data;
      state.loading = false;
    },
  },
});

export const { getCountriesStart, getCountriesSuccess } = countries.actions;
export default countries.reducer;

export const fetchCountries = () => async (dispatch) => {
  try {
    dispatch(getCountriesStart());

    const response = await fetch("/countries/");
    const countries = countryList.filter((item) =>
      response.countries.includes(item.label.toLowerCase())
    );

    dispatch(getCountriesSuccess({ data: countries }));
  } catch (error) {
    // no op
  }
};
