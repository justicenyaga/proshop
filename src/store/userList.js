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
      userList.users = userList.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },

    userListReseted: (userList, action) => {
      userList.users = [];
      userList.successDelete = false;
      userList.successUpdate = false;
      userList.error = null;
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
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
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
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
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
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/users/${user.id}/update/`,
      method: "put",
      data: user,
      headers,
      onSuccess: userUpdated.type,
    })
  );
};

export const deleteMultipleUsers = (userIds) => async (dispatch, getState) => {
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  userIds.forEach(async (userId) => {
    await dispatch(
      apiCallBegun({
        url: `/api/users/${userId}/delete/`,
        method: "delete",
        data: {},
        headers,
        onSuccess: userDeleted.type,
      })
    );
  });
};
