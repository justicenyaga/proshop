import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { toast } from "react-toastify";
import { PayPalButton } from "react-paypal-button-v2";

import FormContainer from "../components/FormContainer";

import { loadOrderDetails, clearError } from "../store/orderDetails";
import { payOrder, resetOrderPay } from "../store/orderPay";
import { clearCart } from "../store/cart";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: orderId } = useParams();

  const [sdkReady, setSdkReady] = useState(false);

  const reduxState = useSelector((state) => state);
  const { order, loading: loadingOrder, error } = reduxState.orderDetails;
  const { userInfo } = reduxState.user;
  const { cartItems } = reduxState.cart;
  const { success: successPay, loading: loadingPay } = reduxState.orderPay;

  useEffect(() => {
    cartItems.length && dispatch(clearCart());

    dispatch(loadOrderDetails(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    !userInfo?.id && navigate("/login");

    if (error === "You are not authorized to view this order") {
      toast.error(error);
      navigate("/profile/orders");
      dispatch(clearError());
    }

    order._id &&
      order.paymentMethod !== "paypal" &&
      navigate(`/profile/orders/${orderId}`);

    if (successPay) {
      toast.success("Order Paid");
      navigate(`/profile/orders/${orderId}`);
      dispatch(resetOrderPay());
    } else {
      if (order._id && order.isPaid) {
        toast.error("Order is already paid");
        navigate(`/profile/orders/${orderId}`);
      }
    }

    if (!order?.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, navigate, successPay, order, error]);

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AS5LcoTOrmwavIBTbinGY62cjZCCQGAeZ2CGoR0eBDBqTGkw7rwJgjLU5mr4wmhBu1jLn9mKMIf2nK_d";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  const handleSuccessPayment = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  return (
    <FormContainer>
      {loadingOrder ? (
        <CircularProgress size={100} color="inherit" />
      ) : (
        <>
          <Box
            border={1}
            borderColor={grey[300]}
            borderRadius={1}
            width="100%"
            p={1}
            mb={2}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                Order Items Price:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                $
                {order?.orderItems
                  .reduce((acc, item) => acc + item.price * item.qty, 0)
                  .toFixed(2)}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                Shipping Price:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                ${order?.shippingPrice}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                Tax Price:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                ${order?.taxPrice}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: 16 }}
              >
                Total Amount To Pay:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 550, fontSize: 16 }}
              >
                ${order?.totalPrice}
              </Typography>
            </Stack>
          </Box>

          {loadingPay ? (
            <CircularProgress color="inherit" />
          ) : sdkReady ? (
            <PayPalButton
              amount={order.totalPrice}
              onSuccess={handleSuccessPayment}
            />
          ) : (
            <CircularProgress color="inherit" />
          )}
        </>
      )}
    </FormContainer>
  );
};

export default PaymentPage;
