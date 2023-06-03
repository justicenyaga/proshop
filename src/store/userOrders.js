import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "userOrders",

  initialState: {
    orders: [],
    loading: false,
    error: null,
  },

  reducers: {
    userOrdersRequested: (orders, action) => {
      orders.loading = true;
    },

    userOrdersReceived: (orders, action) => {
      orders.orders = action.payload;
      orders.loading = false;
    },

    userOrdersRequestFailed: (orders, action) => {
      orders.error = action.payload;
      orders.loading = false;
    },

    userOrdersCleared: (orders, action) => {
      orders.orders = [];
      orders.loading = false;
      orders.error = null;
    },
  },
});

const {
  userOrdersRequested,
  userOrdersReceived,
  userOrdersRequestFailed,
  userOrdersCleared,
} = slice.actions;
export default slice.reducer;

export const loadUserOrders = () => (dispatch, getState) => {
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/orders/user-orders/`,
      method: "get",
      headers,
      onStart: userOrdersRequested.type,
      onSuccess: userOrdersReceived.type,
      onError: userOrdersRequestFailed.type,
    })
  );
};

export const resetUserOrders = () => (dispatch) => {
  dispatch({ type: userOrdersCleared.type });
};
