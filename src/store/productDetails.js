import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "productDetails",

  initialState: {
    product: {
      reviews: [],
    },
    loading: false,
    error: null,

    loadingReview: false,
    successReview: false,
    errorReview: null,
  },

  reducers: {
    productDetailsRequested: (productDetails, action) => {
      productDetails.loading = true;
    },

    productDetailsReceived: (productDetails, action) => {
      productDetails.product = action.payload;
      productDetails.loading = false;
    },

    productDetailsRequestFailed: (productDetails, action) => {
      productDetails.error = action.payload;
      productDetails.loading = false;
    },

    productReviewRequested: (productDetails, action) => {
      productDetails.loadingReview = true;
    },

    productReviewed: (productDetails, action) => {
      productDetails.product = action.payload;
      productDetails.loadingReview = false;
      productDetails.successReview = true;
    },

    productReviewRequestFailed: (productDetails, action) => {
      productDetails.errorReview = action.payload;
      productDetails.loadingReview = false;
    },

    productReviewResetted: (productDetails, action) => {
      productDetails.successReview = false;
      productDetails.errorReview = null;
    },
  },
});

const {
  productDetailsRequested,
  productDetailsReceived,
  productDetailsRequestFailed,
  productReviewRequested,
  productReviewed,
  productReviewRequestFailed,
  productReviewResetted,
} = slice.actions;
export default slice.reducer;

// Action creators

export const getProductDetails = (productId) =>
  apiCallBegun({
    url: `/api/products/${productId}/`,
    onStart: productDetailsRequested.type,
    onSuccess: productDetailsReceived.type,
    onError: productDetailsRequestFailed.type,
  });

export const reviewProduct = (productId, review) => (dispatch, getState) => {
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/products/${productId}/reviews/`,
      method: "post",
      data: review,
      headers,
      onStart: productReviewRequested.type,
      onSuccess: productReviewed.type,
      onError: productReviewRequestFailed.type,
    })
  );
};

export const resetProductReview = () => (dispatch) => {
  dispatch({ type: productReviewResetted.type });
};
