import React from "react";
import { Container } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useTheme, useMediaQuery } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

import ActivationPage from "./pages/ActivationPage";
import BottomBar from "./components/BottomBar";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutAddresses from "./pages/CheckoutAddresses";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import NotVerifiedPage from "./pages/NotVerifiedPage";
import OrderListPage from "./pages/OrderListPage";
import OrderPage from "./pages/OrderPage";
import PageNotFound from "./pages/PageNotFound";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceorderPage from "./pages/PlaceorderPage";
import ProductEditPage from "./pages/ProductEditPage";
import ProductListPage from "./pages/ProductListPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword";
import SearchPage from "./pages/SearchPage";
import ShippingAddressPage from "./pages/ShippingAddressPage";
import UserEditPage from "./pages/UserEditPage";
import UserListPage from "./pages/UserListPage";

const navigationTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "white",
          fontWeight: 550,
          fontSize: 16,
          "&:hover": { color: grey[600] },
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: { backgroundColor: grey[500], color: "white" },
        list: { padding: 0, margin: 0 },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "white",
          "&:hover": { backgroundColor: grey[600] },
        },
      },
    },

    MuiTypography: {
      styleOverrides: { root: { fontWeight: 550, color: "white" } },
    },

    MuiAppBar: {
      styleOverrides: { root: { backgroundColor: grey[800] } },
    },

    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: grey[800],
          width: "100%",
          position: "fixed",
          bottom: 0,
        },
      },
    },

    MuiBottomNavigationAction: {
      styleOverrides: { root: { color: grey[500] } },
    },
  },
});

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div style={{ backgroundColor: "#f1f1f1", minHeight: "100vh" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <ThemeProvider theme={navigationTheme}>
            <Navbar />
          </ThemeProvider>

          <ToastContainer theme="colored" autoClose={2000} />
          <main
            className={isMobile ? "my-2" : "py-3"}
            style={
              isMobile ? { paddingTop: "4rem", paddingBottom: "4rem" } : {}
            }
          >
            <Container>
              <Routes>
                <Route path="/" element={<HomePage />} exact />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/:category" element={<CategoryPage />} />
                <Route
                  path="/:category/:subcategory"
                  element={<CategoryPage />}
                />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/cart/:id" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/not-verified" element={<NotVerifiedPage />} />
                <Route
                  path="/not-verified/:email"
                  element={<NotVerifiedPage />}
                />
                <Route
                  path="/activate/:uid/:token"
                  element={<ActivationPage />}
                />
                <Route
                  path="/reset-password"
                  element={<RequestPasswordReset />}
                />
                <Route
                  path="/reset-password/:uid/:token"
                  element={<ResetPassword />}
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:tab" element={<ProfilePage />} />
                <Route
                  path="/profile/:tab/:section"
                  element={<ProfilePage />}
                />
                <Route path="/address" element={<ShippingAddressPage />} />
                <Route
                  path="/shipping-address"
                  element={<ShippingAddressPage />}
                />
                <Route
                  path="/checkout/addresses"
                  element={<CheckoutAddresses />}
                />
                <Route path="/payment" element={<PaymentMethodPage />} />
                <Route path="/placeorder" element={<PlaceorderPage />} />
                <Route path="/pay/:id" element={<PaymentPage />} />
                <Route path="/admin/users" element={<UserListPage />} />
                <Route path="/admin/users/:id" element={<UserEditPage />} />
                <Route path="/admin/products" element={<ProductListPage />} />
                <Route
                  path="/admin/products/:id"
                  element={<ProductEditPage />}
                />
                <Route path="/admin/orders" element={<OrderListPage />} />
                <Route path="/admin/orders/:id" element={<OrderPage />} />
                <Route path="/page404" element={<PageNotFound />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Container>
          </main>

          {isMobile ? (
            <ThemeProvider theme={navigationTheme}>
              <BottomBar />
            </ThemeProvider>
          ) : (
            <Footer />
          )}
        </Router>
      </LocalizationProvider>
    </div>
  );
}

export default App;
