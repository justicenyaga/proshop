import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";
import { resetUserOrders } from "./userOrders";
import { resetUserList } from "./userList";

import httpService from "../utils/httpService";

const slice = createSlice({
  name: "auth",

  initialState: {
    userInfo: {},
    addresses: [],
    isAuthenticated: false,
    lastVerified: null,
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
      localStorage.removeItem("addresses");
    },

    authVerificationSuccess: (auth, action) => {
      auth.isAuthenticated = true;
      auth.lastVerified = Date.now();
    },

    authVerificationFailed: (auth, action) => {
      auth.isAuthenticated = false;
      auth.lastVerified = null;
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

    emailChangeRequested: (auth, action) => {
      auth.loading = true;
    },

    emailChanged: (auth, action) => {
      auth.emailChangeSuccess = true;
      auth.loading = false;

      localStorage.removeItem("userInfo");
    },

    emailChangeFailed: (auth, action) => {
      auth.error = action.payload;
      auth.loading = false;
    },

    passwordChangeRequested: (auth, action) => {
      auth.loading = true;
    },

    passwordChanged: (auth, action) => {
      auth.passwordChangeSuccess = true;
      auth.loading = false;
    },

    passwordChangeFailed: (auth, action) => {
      auth.error = action.payload;
      auth.loading = false;
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
      localStorage.removeItem("addresses");
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

    userAddressesRequested: (auth, action) => {
      auth.loading = true;
    },

    userAddressesReceived: (auth, action) => {
      auth.addresses = action.payload;
      auth.loading = false;

      localStorage.setItem("addresses", JSON.stringify(action.payload));
    },

    userAddressesRequestFailed: (auth, action) => {
      auth.loading = false;
      auth.error = action.payload;

      localStorage.removeItem("addresses");
    },

    userAddressAdded: (auth, action) => {
      auth.addresses.push(action.payload);

      localStorage.setItem("addresses", JSON.stringify(auth.addresses));
    },

    userAddressUpdated: (auth, action) => {
      auth.addresses = auth.addresses.map((address) =>
        address._id === action.payload._id ? action.payload : address
      );

      localStorage.setItem("addresses", JSON.stringify(auth.addresses));
    },

    userAddressDeleted: (auth, action) => {
      auth.addresses = auth.addresses.filter(
        (address) => address._id !== action.payload
      );

      localStorage.setItem("addresses", JSON.stringify(auth.addresses));
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
      localStorage.removeItem("addresses");
    },

    errorCleared: (auth, action) => {
      auth.error = null;
      // auth.successSignUp && delete auth.successSignUp;
      auth.successPasswordResetRequest &&
        delete auth.successPasswordResetRequest;
      auth.successPasswordReset && delete auth.successPasswordReset;
      auth.emailChangeSuccess && delete auth.emailChangeSuccess;
      auth.passwordChangeSuccess && delete auth.passwordChangeSuccess;
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
  emailChangeRequested,
  emailChanged,
  emailChangeFailed,
  passwordChangeRequested,
  passwordChanged,
  passwordChangeFailed,
  accountDeletionRequested,
  accountDeleted,
  passwordResetRequested,
  passwordResetRequestSuccess,
  passwordResetFailed,
  passwordReset,
  accountDeletionFailed,
  userAddressesRequested,
  userAddressesReceived,
  userAddressesRequestFailed,
  userAddressAdded,
  userAddressUpdated,
  userAddressDeleted,
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

  const { lastVerified } = getState().user;
  const diffInMinutes = (Date.now() - lastVerified) / (1000 * 60);

  if (diffInMinutes < 10) return;

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
  }
};

export const loadUser = () => async (dispatch, getState) => {
  const access = JSON.parse(localStorage.getItem("access"));
  const localStorageUser = JSON.parse(localStorage.getItem("userInfo"));

  const { isAuthenticated, userInfo } = getState().user;

  if (access && isAuthenticated && userInfo?.is_active && localStorageUser?.id)
    return;

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
      Accept: "application/json",
    };

    await dispatch(
      apiCallBegun({
        url: "/api/auth/users/me/",
        method: "GET",
        headers,
        onSuccess: userInfoReceived.type,
      })
    );

    dispatch(getUserAddresses());
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

export const changeEmail =
  (new_email, current_password) => async (dispatch, getState) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${JSON.parse(localStorage.getItem("access"))}`,
    };

    const body = { new_email, re_new_email: new_email, current_password };

    await dispatch(
      apiCallBegun({
        url: "/api/auth/users/set_email/",
        method: "POST",
        data: body,
        headers,
        onStart: emailChangeRequested.type,
        onSuccess: emailChanged.type,
        onError: emailChangeFailed.type,
      })
    );

    dispatch(loadUser());
  };

export const changePassword =
  (new_password, current_password) => async (dispatch, getState) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${JSON.parse(localStorage.getItem("access"))}`,
    };

    const body = {
      new_password,
      re_new_password: new_password,
      current_password,
    };

    await dispatch(
      apiCallBegun({
        url: "/api/auth/users/set_password/",
        method: "POST",
        data: body,
        headers,
        onStart: passwordChangeRequested.type,
        onSuccess: passwordChanged.type,
        onError: passwordChangeFailed.type,
      })
    );
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

export const getUserAddresses = () => async (dispatch) => {
  const access = JSON.parse(localStorage.getItem("access"));

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    };

    await dispatch(
      apiCallBegun({
        url: "/api/addresses/user/",
        method: "GET",
        headers,
        onStart: userAddressesRequested.type,
        onSuccess: userAddressesReceived.type,
        onError: userAddressesRequestFailed.type,
      })
    );
  }
};

export const addUserAddress = (address) => async (dispatch) => {
  const access = JSON.parse(localStorage.getItem("access"));

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    };

    await dispatch(
      apiCallBegun({
        url: "/api/addresses/add/",
        method: "POST",
        data: address,
        headers,
        onSuccess: userAddressAdded.type,
      })
    );

    dispatch(getUserAddresses());
  }
};

export const updateUserAddress = (addressId, data) => async (dispatch) => {
  const access = JSON.parse(localStorage.getItem("access"));

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    };

    await dispatch(
      apiCallBegun({
        url: `/api/addresses/${addressId}/update/`,
        method: "PUT",
        data,
        headers,
        onSuccess: userAddressUpdated.type,
      })
    );

    dispatch(getUserAddresses());
  }
};

export const deleteUserAddress = (addressId) => async (dispatch) => {
  const access = JSON.parse(localStorage.getItem("access"));

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    };

    await dispatch(
      apiCallBegun({
        url: `/api/addresses/${addressId}/delete/`,
        method: "DELETE",
        headers,
        onSuccess: userAddressDeleted.type,
      })
    );

    dispatch(getUserAddresses());
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
