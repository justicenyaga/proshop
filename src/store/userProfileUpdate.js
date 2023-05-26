import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "userProfileUpdate",
  initialState: {
    userInfo: {},
    loading: false,
    success: false,
    error: null,
  },

  reducers: {
    profileUpdateRequested: (profile, action) => {
      profile.loading = true;
    },

    profileUpdateSuccess: (profile, action) => {
      profile.userInfo = action.payload;
      profile.loading = false;
      profile.success = true;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      window.location.reload(true);
    },

    profileUpdateRequestFailed: (profile, action) => {
      profile.error = action.payload;
      profile.loading = false;
    },

    profileUpdateResetted: (profile, action) => {
      profile.userInfo = {};
    },
  },
});

const {
  profileUpdateRequested,
  profileUpdateSuccess,
  profileUpdateRequestFailed,
  profileUpdateResetted,
} = slice.actions;
export default slice.reducer;

export const updateUserProfile = (user) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: "/api/users/profile/update/",
      method: "put",
      data: user,
      headers,
      onStart: profileUpdateRequested.type,
      onSuccess: profileUpdateSuccess.type,
      onError: profileUpdateRequestFailed.type,
    })
  );
};

export const resetProfileUpdate = () => (dispatch) => {
  dispatch({ type: profileUpdateResetted.type });
};
