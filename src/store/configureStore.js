import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import api from "./middleware/api";

const cartItemsFromLocalStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const categories = localStorage.getItem("categories")
  ? JSON.parse(localStorage.getItem("categories"))
  : [];

const subCategories = localStorage.getItem("subCategories")
  ? JSON.parse(localStorage.getItem("subCategories"))
  : [];

const hotCategories = localStorage.getItem("hotCategories")
  ? JSON.parse(localStorage.getItem("hotCategories"))
  : [];

const userInfoFromLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : {};

const shippingAddressFromLocalStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const paymentMethodFromLocalStorage = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : "";

const initialState = {
  cart: {
    cartItems: cartItemsFromLocalStorage,
    shippingAddress: shippingAddressFromLocalStorage,
    paymentMethod: paymentMethodFromLocalStorage,
  },
  user: { userInfo: userInfoFromLocalStorage },
  categories: {
    categoryList: categories,
    subCategoryList: subCategories,
    hotCategories: hotCategories,
  },
};

export default function () {
  return configureStore({
    reducer,
    preloadedState: initialState,
    middleware: [...getDefaultMiddleware(), api],
  });
}
