import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";
import { resetUserOrders } from "./userOrders";
import { resetUserList } from "./userList";

import httpService from "../utils/httpService";

const slice = createSlice({
  name: "auth",

  initialState: {
    userInfo: {},
    isAuthenticated: false,
    access: "",
    refresh: "",
    keepMeLoggedIn: false,
    loading: false,
    error: null,
  },

  reducers: {
    userAuthRequested: (auth, action) => {
      auth.loading = true;
    },

    userAuthSuccess: (auth, action) => {
      auth.access = action.payload.access;
      auth.refresh = action.payload.refresh;
      auth.isAuthenticated = true;
      auth.loading = false;
      auth.error = null;

      localStorage.setItem("access", JSON.stringify(action.payload.access));
      localStorage.setItem("refresh", JSON.stringify(action.payload.refresh));
    },

    userAuthFailed: (auth, action) => {
      auth.access = null;
      auth.refresh = null;
      auth.isAuthenticated = false;
      auth.error = action.payload;
      auth.loading = false;

      auth.successSignUp && delete auth.successSignUp;

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("userInfo");
    },

    authVerificationSuccess: (auth, action) => {
      auth.isAuthenticated = true;
    },

    authVerificationFailed: (auth, action) => {
      auth.isAuthenticated = false;
    },

    userInfoReceived: (auth, action) => {
      auth.userInfo = action.payload;
      auth.loading = false;

      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    userSignedUp: (auth, action) => {
      auth.isAuthenticated = false;
      auth.successSignUp = true;
      auth.userInfo = action.payload;
      auth.loading = false;

      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    userUpdateRequested: (auth, action) => {
      auth.loading = true;
    },

    userUpdated: (auth, action) => {
      auth.userInfo = action.payload;
      auth.loading = false;
      auth.error = null;

      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    userUpdateFailed: (auth, action) => {
      auth.loading = false;
      auth.error = action.payload;
    },

    accountDeletionRequested: (auth, action) => {
      auth.loading = true;
    },

    accountDeleted: (auth, action) => {
      auth.userInfo = {};
      auth.isAuthenticated = false;
      auth.access = null;
      auth.refresh = null;
      auth.error = null;
      auth.loading = false;

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("userInfo");
    },

    passwordResetRequested: (auth, action) => {
      auth.loading = true;
    },

    passwordResetRequestSuccess: (auth, action) => {
      auth.loading = false;
      auth.successPasswordResetRequest = true;
    },

    passwordReset: (auth, action) => {
      auth.loading = false;
      auth.successPasswordReset = true;
    },

    passwordResetFailed: (auth, action) => {
      auth.loading = false;
      auth.error = action.payload;
    },

    accountDeletionFailed: (auth, action) => {
      auth.loading = false;
      auth.error = action.payload;
    },

    userLoggedOut: (auth, action) => {
      auth.userInfo = {};
      auth.isAuthenticated = false;
      auth.access = null;
      auth.refresh = null;
      auth.error = null;

      auth.successSignUp && delete auth.successSignUp;
      auth.successPasswordResetRequest &&
        delete auth.successPasswordResetRequest;
      auth.successPasswordReset && delete auth.successPasswordReset;

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("userInfo");
    },

    errorCleared: (auth, action) => {
      auth.error = null;
      auth.successSignUp && delete auth.successSignUp;
      auth.successPasswordResetRequest &&
        delete auth.successPasswordResetRequest;
      auth.successPasswordReset && delete auth.successPasswordReset;
    },
  },
});

const {
  userAuthRequested,
  userAuthSuccess,
  userAuthFailed,
  authVerificationSuccess,
  authVerificationFailed,
  userInfoReceived,
  userSignedUp,
  userUpdateRequested,
  userUpdated,
  userUpdateFailed,
  accountDeletionRequested,
  accountDeleted,
  passwordResetRequested,
  passwordResetRequestSuccess,
  passwordResetFailed,
  passwordReset,
  accountDeletionFailed,
  userLoggedOut,
  errorCleared,
} = slice.actions;
export default slice.reducer;

const headers = {
  "Content-Type": "application/json",
};

export const refrestToken = () => async (dispatch, getState) => {
  const refresh = JSON.parse(localStorage.getItem("refresh"));

  if (refresh) {
    const data = { refresh };

    try {
      const response = await httpService.post(
        "/api/auth/jwt/refresh/",
        data,
        headers
      );

      localStorage.setItem("access", JSON.stringify(response.data.access));
      dispatch({ type: "Token Refreshed" });
    } catch (error) {
      dispatch({ type: "Token Refresh Failed", payload: error.response.data });
    }
  } else {
    dispatch({
      type: "Token Refresh Failed",
      payload: "No refresh token found",
    });
  }
};

export const checkAuthentication = () => async (dispatch, getState) => {
  const access = JSON.parse(localStorage.getItem("access"));

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const data = { token: access };

    try {
      const response = await httpService.post(
        "/api/auth/jwt/verify/",
        data,
        headers
      );

      if (response.data.code !== "token_not_valid") {
        await dispatch(authVerificationSuccess());
      }
    } catch (error) {
      dispatch(authVerificationFailed());
      dispatch(logout());
    }
  } else {
    dispatch(authVerificationFailed());
    dispatch(logout());
  }
};

export const loadUser = () => (dispatch) => {
  const access = JSON.parse(localStorage.getItem("access"));

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
      Accept: "application/json",
    };

    dispatch(
      apiCallBegun({
        url: "/api/auth/users/me/",
        method: "GET",
        headers,
        onSuccess: userInfoReceived.type,
      })
    );
  }
};

export const login = (email, password) => async (dispatch) => {
  const body = { email, password };

  await dispatch(
    apiCallBegun({
      url: "/api/users/login/",
      method: "POST",
      data: body,
      headers,
      onStart: userAuthRequested.type,
      onSuccess: userAuthSuccess.type,
      onError: userAuthFailed.type,
    })
  );

  dispatch(loadUser());
};

export const signup =
  (first_name, last_name, email, password) => async (dispatch) => {
    const body = {
      first_name,
      last_name,
      email,
      password,
      re_password: password,
    };

    await dispatch(
      apiCallBegun({
        url: "/api/auth/users/",
        method: "POST",
        data: body,
        headers,
        onStart: userAuthRequested.type,
        onSuccess: userSignedUp.type,
        onError: userAuthFailed.type,
      })
    );
  };

export const activateAccount = (uid, token) => async (dispatch) => {
  const body = { uid, token };

  await dispatch(
    apiCallBegun({
      url: "/api/users/activate/",
      method: "POST",
      data: body,
      headers,
      onStart: userAuthRequested.type,
      onSuccess: userAuthSuccess.type,
      onError: userAuthFailed.type,
    })
  );

  dispatch(loadUser());
};

export const resendActivationLink = (email) => async (dispatch) => {
  const body = { email };

  try {
    await httpService.post("/api/auth/users/resend_activation/", body, headers);
    dispatch({ type: "Activation Link Sent" });
  } catch (error) {
    dispatch({ type: "Activation Link Failed" });
  }
};

export const requestEmailReset = (email) => async (dispatch) => {
  const body = { email };

  try {
    await httpService.post("/api/auth/users/reset_email/", body, headers);
    dispatch({ type: "Email Reset Requested" });
  } catch (error) {
    dispatch({ type: "Email Reset Request Failed" });
  }
};

export const resetEmail = (uid, token, new_email) => async (dispatch) => {
  const body = { uid, token, new_email, re_new_email: new_email };

  try {
    await httpService.post(
      "/api/auth/users/reset_email_confirm/",
      body,
      headers
    );
    dispatch({ type: "Email Reset Success" });
  } catch (error) {
    dispatch({ type: "Email Reset Failed" });
  }
};

export const requestPasswordReset = (email) => async (dispatch) => {
  const body = { email };

  await dispatch(
    apiCallBegun({
      url: "/api/users/reset-password/",
      method: "POST",
      data: body,
      headers,
      onStart: passwordResetRequested.type,
      onSuccess: passwordResetRequestSuccess.type,
      onError: passwordResetFailed.type,
    })
  );
};

export const resetPassword = (uid, token, new_password) => async (dispatch) => {
  const body = { uid, token, new_password, re_new_password: new_password };

  await dispatch(
    apiCallBegun({
      url: "/api/auth/users/reset_password_confirm/",
      method: "POST",
      data: body,
      headers,
      onStart: passwordResetRequested.type,
      onSuccess: passwordReset.type,
      onError: passwordResetFailed.type,
    })
  );
};

export const updateProfile =
  (first_name, last_name, gender, dob) => async (dispatch) => {
    const access = JSON.parse(localStorage.getItem("access"));

    if (access) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `JWT ${access}`,
      };

      const body = { first_name, last_name, gender, dob };

      await dispatch(
        apiCallBegun({
          url: "/api/users/update-profile/",
          method: "PUT",
          data: body,
          headers,
          onStart: userUpdateRequested.type,
          onSuccess: userUpdated.type,
          onError: userUpdateFailed.type,
        })
      );

      dispatch(loadUser());
    }
  };

export const deleteAccount = (password) => async (dispatch) => {
  const access = JSON.parse(localStorage.getItem("access"));

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    };

    const body = { current_password: password };

    await dispatch(
      apiCallBegun({
        url: "/api/auth/users/me/",
        method: "DELETE",
        data: body,
        headers,
        onStart: accountDeletionRequested.type,
        onSuccess: accountDeleted.type,
        onError: accountDeletionFailed.type,
      })
    );
  }
};

export const logout = () => (dispatch) => {
  dispatch(userLoggedOut());
  dispatch(resetUserOrders());
  dispatch(resetUserList());
};

export const clearError = () => (dispatch) => {
  dispatch({ type: errorCleared.type });
};
