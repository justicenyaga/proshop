import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "orderDetails",

  initialState: {
    order: {
      orderItems: [],
      shippingAddress: {},
      paymentMethod: "",
      user: {},
    },
    loading: false,
    error: null,
  },

  reducers: {
    orderDetailsRequested: (orderDetails, action) => {
      orderDetails.loading = true;
    },

    orderDetailsReceived: (orderDetails, action) => {
      orderDetails.order = action.payload;
      orderDetails.loading = false;
    },

    orderDetailsRequestFailed: (orderDetails, action) => {
      orderDetails.error = action.payload;
      orderDetails.loading = false;
    },

    orderDetailsReset: (orderDetails, action) => {
      orderDetails.order = {
        orderItems: [],
        shippingAddress: {},
        paymentMethod: "",
        user: {},
      };
      orderDetails.loading = false;
      orderDetails.error = null;
    },

    errorCleared: (orderDetails, action) => {
      orderDetails.error = null;
    },
  },
});

const {
  orderDetailsRequested,
  orderDetailsReceived,
  orderDetailsRequestFailed,
  orderDetailsReset,
  errorCleared,
} = slice.actions;
export default slice.reducer;

export const loadOrderDetails = (orderId) => (dispatch, getState) => {
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/orders/${orderId}/`,
      method: "get",
      headers,
      onStart: orderDetailsRequested.type,
      onSuccess: orderDetailsReceived.type,
      onError: orderDetailsRequestFailed.type,
    })
  );
};

export const resetOrderDetails = () => (dispatch) => {
  dispatch({ type: orderDetailsReset.type });
};

export const clearError = () => (dispatch) => {
  dispatch({ type: errorCleared.type });
};
