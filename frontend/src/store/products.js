import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";

const slice = createSlice({
  name: "products",

  initialState: {
    productsList: [],
    topRatedProducts: [],
    loading: false,
    error: null,

    successDelete: false,
    successCreate: false,

    loadingTopRated: false,
    errorTopRated: null,
  },

  reducers: {
    productsRequested: (products, action) => {
      products.loading = true;
    },

    productsReceived: (products, action) => {
      products.productsList = action.payload;
      products.loading = false;
    },

    productsRequestFailed: (products, action) => {
      products.error = action.payload;
      products.loading = false;
    },

    productCreated: (products, action) => {
      products.productsList.push(action.payload);
      products.successCreate = true;
      products.createdProduct = action.payload;
    },

    productUpdated: (products, action) => {
      const index = products.productsList.findIndex(
        (product) => product._id === action.payload._id
      );
      products.productsList[index] = action.payload;
      window.location.reload();
    },

    createdProductRemoved: (products) => {
      delete products.createdProduct;
      products.successCreate = false;
    },

    productDeleted: (products, action) => {
      const index = products.productsList.findIndex(
        (product) => product.createdAt === action.payload.createdAt
      );
      products.productsList.splice(index, 1);
      products.successDelete = true;
    },

    topRatedProductsRequested: (products, action) => {
      products.loadingTopRated = true;
    },

    topRatedProductsReceived: (products, action) => {
      products.topRatedProducts = action.payload;
      products.loadingTopRated = false;
    },

    topRatedProductsRequestFailed: (products, action) => {
      products.errorTopRated = action.payload;
      products.loadingTopRated = false;
    },
  },
});

const {
  productsRequested,
  productsReceived,
  productsRequestFailed,
  productCreated,
  productUpdated,
  createdProductRemoved,
  productDeleted,
  topRatedProductsRequested,
  topRatedProductsReceived,
  topRatedProductsRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators

export const loadProducts =
  (searchQuery = "") =>
  (dispatch) => {
    dispatch(
      apiCallBegun({
        url: `/api/products?query=${searchQuery}`,
        onSuccess: productsReceived.type,
        onError: productsRequestFailed.type,
        onStart: productsRequested.type,
      })
    );
  };

export const createProduct = () => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: "/api/products/create/",
      method: "post",
      data: {},
      headers,
      onSuccess: productCreated.type,
    })
  );
};

export const updateProduct = (product) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/products/${product._id}/update/`,
      method: "put",
      data: product,
      headers,
      onSuccess: productUpdated.type,
    })
  );
};

export const removeCreatedProduct = () => (dispatch) => {
  dispatch({ type: createdProductRemoved.type });
};

export const deleteProduct = (productId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegun({
      url: `/api/products/${productId}/delete/`,
      method: "delete",
      headers,
      onSuccess: productDeleted.type,
    })
  );
};

export const loadTopRatedProducts = () => (dispatch) => {
  dispatch(
    apiCallBegun({
      url: "/api/products/top/",
      method: "get",
      onStart: topRatedProductsRequested.type,
      onSuccess: topRatedProductsReceived.type,
      onError: topRatedProductsRequestFailed.type,
    })
  );
};
