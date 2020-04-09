import { createSlice } from "@reduxjs/toolkit";

import fetch from "../utils/fetch";
import { showToaster } from "./toasterSlice";

const savedName = localStorage.getItem("session.name");
const savedToken = localStorage.getItem("session.token");
const initialState = {
  name: savedName || "",
  token: savedToken || "",
  isSignedIn: Boolean(savedToken),
  isSignedUp: false,
  showSignInModal: false,
  showSignUpModal: false,
  loading: false,
};

const session = createSlice({
  name: "session",
  initialState,
  reducers: {
    getShowSignInModal(state) {
      state.showSignInModal = true;
      state.showSignUpModal = false;
    },
    getShowSignUpModal(state) {
      state.showSignInModal = false;
      state.showSignUpModal = true;
    },
    getHideSessionModal(state) {
      state.showSignInModal = false;
      state.showSignUpModal = false;
    },
    getSessionStart(state) {
      state.loading = true;
      state.isSignedUp = false;
    },
    getLoginSuccess(state, action) {
      const { name, token } = action.payload;

      state.name = name;
      state.token = token;
      state.isSignedIn = true;
      localStorage.setItem("session.name", name);
      localStorage.setItem("session.token", token);
    },
    getLogoutSuccess(state) {
      state.name = "";
      state.token = "";
      state.isSignedIn = false;
      localStorage.removeItem("session.name");
      localStorage.removeItem("session.token");
    },
    getSignupSuccess(state) {
      state.loading = false;
      state.isSignedUp = true;
    }
  },
});

export const {
  getShowSignInModal,
  getShowSignUpModal,
  getHideSessionModal,
  getSessionStart,
  getLoginSuccess,
  getLogoutSuccess,
  getSignupSuccess,
} = session.actions;
export default session.reducer;

export const signIn = ({ username, password }) => async (dispatch) => {
  try {
    dispatch(getSessionStart());

    const body = { username, password };
    const response = await fetch("/users/login/", {
      method: 'post',
      body,
    });

    dispatch(getLoginSuccess({ ...response }));
    dispatch(showToaster({ message: `Welcome ${response.name}!` }));
  } catch (error) {
    const { non_field_errors } = error;

    dispatch(
      showToaster({
        message: non_field_errors
          ? non_field_errors[0]
          : "Unable to sign in. Please try again.",
      })
    );
  }
};

export const logout = () => async (dispatch, getState) => {
  dispatch(getLogoutSuccess());
  dispatch(showToaster({ message: "Sign out successful" }));

  try {
    let token = getState().session.token;

    await fetch("/users/logout/", {
      headers: { Authorization: `Token ${token}` },
    });
  } catch (error) {
    // no op
  }
};

export const signUp = ({ name, email, password }) => async (dispatch) => {
  try {
    dispatch(getSessionStart());

    const body = {
      name,
      email,
      password,
    };
    await fetch("/users/profile/", {
      method: 'post',
      body,
    });

    dispatch(getSignupSuccess());
    dispatch(showToaster({ message: `Sign up successful!` }));
  } catch (error) {
    const { email, non_field_errors } = error;
    const field = email || non_field_errors;

    dispatch(
      showToaster({
        message: field ? field[0] : "Unable to sign up. Please try again.",
      })
    );
  }
};
