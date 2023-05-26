import { combineReducers } from "redux";

import productsReducer from "./products";
import productDetailsReducer from "./productDetails";

import categoriesReducer from "./categories";

import cartReducer from "./cart";

import userReducer from "./user";
import userDetailsReducer from "./userDetails";
import userProfileUpdateReducer from "./userProfileUpdate";
import userListReducer from "./userList";
import userOrdersReducer from "./userOrders";

import orderReducer from "./order";
import orderDetailsReducer from "./orderDetails";
import orderPayReducer from "./orderPay";
import orderListReducer from "./orderList";

export default combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  categories: categoriesReducer,
  user: userReducer,
  userList: userListReducer,
  userDetails: userDetailsReducer,
  userProfileUpdate: userProfileUpdateReducer,
  userOrders: userOrdersReducer,
  order: orderReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderList: orderListReducer,
});
