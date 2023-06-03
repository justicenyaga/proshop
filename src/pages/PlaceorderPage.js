import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  Typography,
  List,
  ListItem,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { grey } from "@mui/material/colors";

import { createOrder, resetOrder } from "../store/order";
import { resetUserOrders } from "../store/userOrders";
import { resetOrderDetails } from "../store/orderDetails";

const PlaceorderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const reduxState = useSelector((state) => state);
  const { cart } = reduxState;
  const {
    orderObject,
    success,
    loading: creatingOrder,
    error,
  } = reduxState.order;
  const { userInfo } = reduxState.user;
  const { order: orderDetails } = reduxState.orderDetails;

  let itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  let shippingPrice = (itemsPrice > 100 ? 0 : 10).toFixed(2);

  let taxPrice = Number(itemsPrice * 0.082).toFixed(2);

  let totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  useEffect(() => {
    orderDetails?._id && dispatch(resetOrderDetails());

    if (success) {
      dispatch(resetUserOrders());
      if (cart.paymentMethod === "paypal") {
        navigate(`/pay/${orderObject._id}`);
        dispatch(resetOrder());
      } else navigate(`/profile/orders/${orderObject._id}`);
    } else {
      !userInfo && navigate("/login");
      cart.cartItems?.length === 0 && navigate("/cart");
      !cart.shippingAddress?._id && navigate("/shipping-address");
      !cart.paymentMethod && navigate("/payment");
    }

    error && toast.error(error);
  }, [success, navigate, userInfo, cart, dispatch, error, orderObject]);

  const handlePlaceOrder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        address_id: cart.shippingAddress._id,
        paymentMethod: cart.paymentMethod,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );

    if (cart.paymentMethod === "cash") toast.success("Order placed");
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "10px",
        boxShadow: 3,
        width: isMobile ? "100%" : isTablet ? "90%" : "80%",
        margin: "0 auto",
        px: isTablet ? 5 : isMobile ? 2 : 8,
        py: 3,
      }}
    >
      <CheckoutSteps activeStep={4} />

      <Typography variant="body1" sx={{ mt: 2, fontWeight: 600, fontSize: 20 }}>
        Order Summary
      </Typography>

      <Stack direction={isMobile ? "column" : "row"} spacing={1}>
        <Box
          sx={{ width: isMobile ? "100%" : "70%" }}
          p={1}
          border={1}
          borderColor={grey[300]}
          borderRadius={1}
          boxShadow={3}
        >
          <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 16 }}>
            Shipping Address
          </Typography>

          <Typography
            variant="body2"
            component="p"
            sx={{ fontWeight: 500, fontSize: 16 }}
          >
            {cart.shippingAddress.first_name} {cart.shippingAddress.last_name},
            Tel: {cart.shippingAddress.phone_number}
          </Typography>

          <Typography
            variant="body2"
            component="p"
            sx={{ fontWeight: 500, fontSize: 16 }}
          >
            {cart.shippingAddress.address} - {cart.shippingAddress.city}{" "}
            {cart.shippingAddress.postal_code},{"  "}
            {cart.shippingAddress.country}
          </Typography>

          <Typography
            variant="body1"
            sx={{ mt: 2, fontWeight: 550, fontSize: 16 }}
          >
            Payment Method
          </Typography>

          <Typography
            variant="body2"
            component="p"
            sx={{ fontWeight: 500, fontSize: 16 }}
          >
            {cart.paymentMethod === "paypal"
              ? "Paypal or Credit Card"
              : cart.paymentMethod === "cash"
              ? "Cash on Delivery"
              : ""}
          </Typography>

          <Typography
            variant="body1"
            sx={{ mt: 2, fontWeight: 550, fontSize: 16 }}
          >
            Order Items
          </Typography>

          <List>
            {cart.cartItems.map((item) => (
              <ListItem
                key={item.productId}
                sx={{
                  width: "100%",
                  mb: 0.8,
                  bgcolor: "white",
                  borderRadius: "5px",
                }}
              >
                <Stack direction="column" width="100%">
                  <Stack
                    direction="row"
                    alignItems="center"
                    width="100%"
                    height="fit-content"
                    sx={{ cursor: "pointer" }}
                    spacing={1}
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ minHeight: "60px" }}
                      width={isMobile ? "20%" : "10%"}
                      loading="lazy"
                    />

                    <Stack direction="column" width="100%">
                      <Stack
                        width="100%"
                        direction={{ xs: "column", md: "row" }}
                        alignContent="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ fontSize: isMobile ? 13 : 18, fontWeight: 500 }}
                        >
                          {item.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ fontSize: isMobile ? 12 : 18, fontWeight: 520 }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body2"
                        component="div"
                        sx={{
                          fontSize: isMobile ? 10 : 15,
                        }}
                      >
                        {item.quantity} x {item.price}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box
          sx={{ width: isMobile ? "100%" : "30%" }}
          p={1}
          border={1}
          borderColor={grey[300]}
          borderRadius={1}
          boxShadow={3}
          height="fit-content"
        >
          <List
            disablePadding
            sx={{
              "& .MuiListItem-root": {
                p: 0,
              },
            }}
          >
            <ListItem>
              <Stack direction="row" alignItems="center" width="100%">
                <Typography
                  variant="body2"
                  component="div"
                  width="50%"
                  sx={{ fontSize: 16, fontWeight: 550 }}
                >
                  Items:
                </Typography>

                <Typography
                  variant="body2"
                  component="div"
                  width="50%"
                  sx={{ fontSize: 16, fontWeight: 500 }}
                >
                  ${itemsPrice}
                </Typography>
              </Stack>
            </ListItem>
            <ListItem>
              <Stack direction="row" alignItems="center" width="100%">
                <Typography
                  variant="body2"
                  component="div"
                  width="50%"
                  sx={{ fontSize: 16, fontWeight: 550 }}
                >
                  Shipping:
                </Typography>

                <Typography
                  variant="body2"
                  component="div"
                  width="50%"
                  sx={{ fontSize: 16, fontWeight: 500 }}
                >
                  ${shippingPrice}
                </Typography>
              </Stack>
            </ListItem>
            <ListItem>
              <Stack direction="row" alignItems="center" width="100%">
                <Typography
                  variant="body2"
                  component="div"
                  width="50%"
                  sx={{ fontSize: 16, fontWeight: 550 }}
                >
                  Tax:
                </Typography>

                <Typography
                  variant="body2"
                  component="div"
                  width="50%"
                  sx={{ fontSize: 16, fontWeight: 500 }}
                >
                  ${taxPrice}
                </Typography>
              </Stack>
            </ListItem>
            <ListItem>
              <Stack direction="row" alignItems="center" width="100%">
                <Typography
                  variant="body2"
                  component="div"
                  width="50%"
                  sx={{ fontSize: 16, fontWeight: 550 }}
                >
                  Total:
                </Typography>

                <Typography
                  variant="body2"
                  component="div"
                  width="50%"
                  sx={{ fontSize: 16, fontWeight: 500 }}
                >
                  ${totalPrice}
                </Typography>
              </Stack>
            </ListItem>
            <ListItem sx={{ mt: 1 }}>
              <LoadingButton
                variant="contained"
                color="inherit"
                fullWidth
                onClick={handlePlaceOrder}
                loading={creatingOrder}
              >
                Place Order
              </LoadingButton>
            </ListItem>
          </List>
        </Box>
      </Stack>
    </Box>
  );
};

export default PlaceorderPage;
