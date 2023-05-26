import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "order",

  initialState: {
    orderObject: {},
    success: false,
    loading: false,
    error: null,
  },

  reducers: {
    createOrderRequested: (order, action) => {
      order.loading = true;
    },

    createOrderSuccess: (order, action) => {
      order.orderObject = action.payload;
      order.success = true;
      order.loading = false;
    },

    createOrderFailed: (order, action) => {
      order.error = action.payload;
      order.loading = false;
    },

    orderResetted: (profile, action) => {
      profile.orderObject = {};
      profile.success = false;
      profile.loading = false;
      profile.error = null;
    },
  },
});

const {
  createOrderRequested,
  createOrderSuccess,
  createOrderFailed,
  orderResetted,
} = slice.actions;
export default slice.reducer;

export const createOrder = (order) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: "/api/orders/add/",
      method: "post",
      data: order,
      headers,
      onStart: createOrderRequested.type,
      onSuccess: createOrderSuccess.type,
      onError: createOrderFailed.type,
    })
  );
};

export const resetOrder = () => (dispatch) => {
  dispatch({ type: orderResetted.type });
};
