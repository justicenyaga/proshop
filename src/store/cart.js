import { createSlice } from "@reduxjs/toolkit";
import httpService from "../utils/httpService";

const slice = createSlice({
  name: "cart",

  initialState: {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: "",
  },

  reducers: {
    cartItemAdded: (cart, action) => {
      const item = action.payload;
      const itemExists = cart.cartItems.find(
        (product_x) => product_x.productId === item.productId
      );

      if (itemExists) {
        const newCartItems = cart.cartItems.map((product) =>
          product.productId === item.productId ? item : product
        );

        cart.cartItems = newCartItems;
      } else {
        cart.cartItems.push(item);
      }
    },

    cartItemRemoved: (cart, action) => {
      const index = cart.cartItems.findIndex(
        (product) => product.productId === action.payload
      );

      cart.cartItems.splice(index, 1);
    },

    shippingAddressSaved: (cart, action) => {
      cart.shippingAddress = action.payload;
    },

    paymentMethodSaved: (cart, action) => {
      cart.paymentMethod = action.payload;
    },

    cartCleared: (cart, action) => {
      cart.cartItems = [];
    },
  },
});

const {
  cartItemAdded,
  cartItemRemoved,
  shippingAddressSaved,
  paymentMethodSaved,
  cartCleared,
} = slice.actions;
export default slice.reducer;

// Action creators
export const addItemToCart =
  (productId, quantity) => async (dispatch, getState) => {
    const url = `/api/products/${productId}`;
    const { data } = await httpService.get(url);

    dispatch({
      type: cartItemAdded.type,
      payload: {
        productId: data._id,
        name: data.name,
        price: data.price,
        image: data.image,
        countInStock: data.countInStock,
        quantity,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };

export const removeCartItem = (productId) => async (dispatch, getState) => {
  dispatch({
    type: cartItemRemoved.type,
    payload: productId,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => async (dispatch, getState) => {
  dispatch({
    type: shippingAddressSaved.type,
    payload: data,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => async (dispatch, getState) => {
  dispatch({
    type: paymentMethodSaved.type,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};

export const clearCart = () => async (dispatch, getState) => {
  dispatch({
    type: cartCleared.type,
  });

  localStorage.removeItem("cartItems");
};
