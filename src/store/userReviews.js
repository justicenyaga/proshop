import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "userReviews",
  initialState: {
    userReviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    reviewsRequested: (userReviews, action) => {
      userReviews.loading = true;
    },

    reviewsReceived: (userReviews, action) => {
      userReviews.userReviews = action.payload;
      userReviews.loading = false;
    },

    reviewsRequestFailed: (userReviews, action) => {
      userReviews.error = action.payload;
      userReviews.loading = false;
    },
  },
});

const { reviewsRequested, reviewsReceived, reviewsRequestFailed } =
  slice.actions;
export default slice.reducer;

// Action Creators
export const loadUserReviews = () => async (dispatch) => {
  const token = JSON.parse(localStorage.getItem("access"));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  return await dispatch(
    apiCallBegun({
      url: "/api/products/user/reviews/",
      method: "get",
      headers,
      onStart: reviewsRequested.type,
      onSuccess: reviewsReceived.type,
      onError: reviewsRequestFailed.type,
    })
  );
};
