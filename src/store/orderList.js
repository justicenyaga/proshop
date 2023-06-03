import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "orderList",

  initialState: {
    orders: [],
    loading: false,
    error: null,

    orderDeliver: {},
  },

  reducers: {
    orderListRequested: (orderList, action) => {
      orderList.loading = true;
    },

    orderListReceived: (orderList, action) => {
      orderList.orders = action.payload;
      orderList.loading = false;
    },

    orderListRequestFailed: (orderList, action) => {
      orderList.error = action.payload;
      orderList.loading = false;
    },

    orderDeliverRequested: (orderList, action) => {
      orderList.orderDeliver.loading = true;
    },

    orderDelivered: (orderList, action) => {
      const index = orderList.orders.findIndex(
        (order) => order.id === action.payload._id
      );
      orderList.orders[index] = action.payload;

      orderList.orderDeliver.success = true;
      orderList.orderDeliver.loading = false;
    },

    orderDeliverDeleted: (orderList, action) => {
      orderList.orderDeliver = {};
    },
  },
});

const {
  orderListRequested,
  orderListReceived,
  orderListRequestFailed,
  orderDelivered,
  orderDeliverDeleted,
} = slice.actions;
export default slice.reducer;

//Actions
export const loadOrders = () => (dispatch, getState) => {
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: "/api/orders/",
      method: "get",
      headers,
      onStart: orderListRequested.type,
      onSuccess: orderListReceived.type,
      onError: orderListRequestFailed.type,
    })
  );
};

export const deliverOrder = (orderId) => (dispatch, getState) => {
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/orders/${orderId}/deliver/`,
      method: "put",
      data: {},
      headers,
      onSuccess: orderDelivered.type,
    })
  );
};

export const deleteOrderDeliver = () => (dispatch) => {
  dispatch({ type: orderDeliverDeleted.type });
};

export const deliverMultipleOrders =
  (orderIds) => async (dispatch, getState) => {
    const token = JSON.parse(localStorage.getItem("access"));

    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    };

    orderIds.forEach(async (orderId) => {
      await dispatch(
        apiCallBegun({
          url: `/api/orders/${orderId}/deliver/`,
          method: "put",
          data: {},
          headers,
          onSuccess: orderDelivered.type,
        })
      );
    });
  };
