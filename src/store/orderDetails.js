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
  },
});

const {
  orderDetailsRequested,
  orderDetailsReceived,
  orderDetailsRequestFailed,
} = slice.actions;
export default slice.reducer;

export const loadOrderDetails = (orderId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
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
