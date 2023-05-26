import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "orderPay",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },

  reducers: {
    orderPayRequested: (orderPay, action) => {
      orderPay.loading = true;
    },

    orderPaySuccess: (orderPay, action) => {
      orderPay.loading = false;
      orderPay.success = true;
    },

    orderPayRequestFailed: (orderPay, action) => {
      orderPay.error = action.payload;
      orderPay.loading = false;
    },

    orderPayResetted: (orderPay, action) => {
      orderPay.loading = false;
      orderPay.success = false;
      orderPay.error = null;
    },
  },
});

const {
  orderPayRequested,
  orderPaySuccess,
  orderPayRequestFailed,
  orderPayResetted,
} = slice.actions;
export default slice.reducer;

export const payOrder = (orderId, paymentResult) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/orders/${orderId}/pay/`,
      method: "put",
      data: paymentResult,
      headers,
      onStart: orderPayRequested.type,
      onSuccess: orderPaySuccess.type,
      onError: orderPayRequestFailed.type,
    })
  );
};

export const resetOrderPay = () => (dispatch) => {
  dispatch({ type: orderPayResetted.type });
};
