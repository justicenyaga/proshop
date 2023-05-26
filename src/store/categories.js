import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "categories",
  initialState: {
    categoryList: [],
    subCategoryList: [],
    hotCategories: [],
    loading: false,
    error: null,
    lastFetch: null,
  },
  reducers: {
    categoriesRequested: (categories, action) => {
      categories.loading = true;
    },

    categoriesReceived: (categories, action) => {
      categories.categoryList = action.payload;
      categories.loading = false;

      categories.lastFetch = Date.now();

      localStorage.setItem(
        "categories",
        JSON.stringify(categories.categoryList)
      );
    },

    subCategoriesReceived: (categories, action) => {
      categories.subCategoryList = action.payload;
      categories.loading = false;

      categories.lastFetch = Date.now();

      localStorage.setItem(
        "subCategories",
        JSON.stringify(categories.subCategoryList)
      );
    },

    hotCategoriesReceived: (categories, action) => {
      categories.hotCategories = action.payload;
      categories.loading = false;

      localStorage.setItem(
        "hotCategories",
        JSON.stringify(categories.hotCategories)
      );
    },

    categoriesRequestFailed: (categories, action) => {
      categories.loading = false;
      categories.error = action.payload;
    },
  },
});

export const {
  categoriesRequested,
  categoriesReceived,
  subCategoriesReceived,
  hotCategoriesReceived,
  categoriesRequestFailed,
} = slice.actions;

export default slice.reducer;

// Action creators
const url = "/api/categories/";

export const loadCategories = () => (dispatch, getState) => {
  const { lastFetch } = getState().categories;
  const diffInMinutes = (Date.now() - lastFetch) / (1000 * 60);

  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegun({
      url,
      onStart: categoriesRequested.type,
      onSuccess: categoriesReceived.type,
      onError: categoriesRequestFailed.type,
    })
  );
};

export const loadSubCategories = () => (dispatch, getState) => {
  const { lastFetch } = getState().categories;
  const diffInMinutes = (Date.now() - lastFetch) / (1000 * 60);

  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegun({
      url: `${url}sub/`,
      onStart: categoriesRequested.type,
      onSuccess: subCategoriesReceived.type,
      onError: categoriesRequestFailed.type,
    })
  );
};

export const loadHotCategories = () => (dispatch, getState) => {
  return dispatch(
    apiCallBegun({
      url: `${url}hot-categories/`,
      onStart: categoriesRequested.type,
      onSuccess: hotCategoriesReceived.type,
      onError: categoriesRequestFailed.type,
    })
  );
};
