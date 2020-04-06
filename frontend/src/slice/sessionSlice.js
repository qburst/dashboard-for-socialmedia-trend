import { createSlice } from "@reduxjs/toolkit";

import api from "../utils/api";
import { showToaster } from "../toasterSlice";

const savedName = localStorage.getItem("session.name");
const savedToken = localStorage.getItem("session.token");
const initialState = {
  data: {
    name: savedName || "",
    token: savedToken || "",
  },
  loading: false,
  error: null,
};

const session = createSlice({
  name: "session",
  initialState,
  reducers: {
    getSessionStart(state) {
      state.loading = true;
      state.error = null;
    },
    getLoginSuccess(state, action) {
      const { name, token } = action.payload;

      state.name = name;
      state.token = token;
      localStorage.setItem("session.name", name);
      localStorage.setItem("session.token", token);
    },
    getLogoutSuccess(state) {
      state.name = "";
      state.token = "";
      localStorage.removeItem("session.name");
      localStorage.removeItem("session.token");
    },
    getSignupSuccess(state) {
      state.loading = false;
      state.error = null;
    },
    getSessionFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getSessionStart,
  getLoginSuccess,
  getLogoutSuccess,
  getSignupSuccess,
  getSessionFailure,
} = session.actions;
export default session.reducer;

export const login = ({ username, password }) => async (dispatch) => {
  try {
    dispatch(getSessionStart());

    const response = await api.post("/users/login", {
      username,
      password,
    });

    dispatch(getLoginSuccess({ ...response }));
    dispatch(showToaster({ message: `Welcome ${response.name}!` }));
  } catch (err) {
    dispatch(getSessionFailure(err));
    dispatch(showToaster({ message: `Unable to login. Please try again.` }));
  }
};

export const logout = () => async (dispatch) => {
  dispatch(getLogoutSuccess());
  dispatch(showToaster({ message: "Logged out successfully" }));

  try {
    let token = localStorage.getItem("session.token");

    await api.get("/users/logout", {
      headers: { Authorization: `Token ${token}` },
    });
  } catch (err) {
    // no op
  }
};

export const signUp = ({ name, email, password }) => async (dispatch) => {
  try {
    dispatch(getSessionStart());

    await api.post("/users/profile", {
      name,
      email,
      password,
    });

    dispatch(getSignupSuccess());
    dispatch(showToaster({ message: `Signup successfully!` }));
  } catch (err) {
    dispatch(getSessionFailure(err));
    dispatch(showToaster({ message: `Unable to signup. Please try again.` }));
  }
};
