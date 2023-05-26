import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "userList",

  initialState: {
    users: [],
    loading: false,
    error: null,

    successDelete: false,
    successUpdate: false,
  },

  reducers: {
    userListRequested: (userList, action) => {
      userList.loading = true;
    },

    userListReceived: (userList, action) => {
      userList.users = action.payload;
      userList.loading = false;
    },

    userListRequestFailed: (userList, action) => {
      userList.error = action.payload;
      userList.loading = false;
    },

    userDeleted: (userList, action) => {
      const index = userList.users.findIndex(
        (user) => user.email === action.payload.email
      );

      userList.users.splice(index, 1);
      userList.successDelete = true;
    },

    userUpdated: (userList, action) => {
      userList.successUpdate = true;
      window.location.reload();
    },

    userListReseted: (userList, action) => {
      userList.users = [];
    },
  },
});

const {
  userListRequested,
  userListReceived,
  userListRequestFailed,
  userDeleted,
  userUpdated,
  userListReseted,
} = slice.actions;
export default slice.reducer;

export const loadUsers = () => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: "/api/users/",
      method: "get",
      headers,
      onStart: userListRequested.type,
      onSuccess: userListReceived.type,
      onError: userListRequestFailed.type,
    })
  );
};

export const resetUserList = () => (dispatch) => {
  dispatch({ type: userListReseted.type });
};

export const deleteUser = (userId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/users/${userId}/delete/`,
      method: "delete",
      headers,
      onSuccess: userDeleted.type,
    })
  );
};

export const updateUser = (user) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/users/${user._id}/update/`,
      method: "put",
      data: user,
      headers,
      onSuccess: userUpdated.type,
    })
  );
};
