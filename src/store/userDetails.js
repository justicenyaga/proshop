import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "userDetails",

  initialState: {
    user: {},
    loading: false,
    error: null,
  },

  reducers: {
    userDetailsRequested: (userDetails, action) => {
      userDetails.loading = true;
    },

    userDetailsReceived: (userDetails, action) => {
      userDetails.user = action.payload;
      userDetails.loading = false;
    },

    userDetailsRequestFailed: (userDetails, action) => {
      userDetails.error = action.payload;
      userDetails.loading = false;
    },

    userDetailsCleared: (userDetails, action) => {
      userDetails.user = {};
      userDetails.error = null;
    },
  },
});

const {
  userDetailsRequested,
  userDetailsReceived,
  userDetailsRequestFailed,
  userDetailsCleared,
} = slice.actions;
export default slice.reducer;

export const getUserDetails = (id) => (dispatch, getState) => {
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/users/${id}/`,
      method: "get",
      headers,
      onStart: userDetailsRequested.type,
      onSuccess: userDetailsReceived.type,
      onError: userDetailsRequestFailed.type,
    })
  );
};

export const clearUserDetails = () => (dispatch) => {
  dispatch({ type: userDetailsCleared.type });
};
