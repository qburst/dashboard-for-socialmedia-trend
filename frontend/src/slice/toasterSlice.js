import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: '',
  show: false,
};

const toaster = createSlice({
  name: "toaster",
  initialState,
  reducers: {
    showToaster(state, action) {
      state.message = action.payload.message;
      state.show = true;
    },
    hideToaster(state) {
      state.message = '';
      state.show = false;
    }
  },
});

export const {
  showToaster,
  hideToaster,
} = toaster.actions;
export default toaster.reducer;