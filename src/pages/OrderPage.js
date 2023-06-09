import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CircularProgress,
  Button,
  IconButton,
  Chip,
  Typography,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { loadOrderDetails } from "../store/orderDetails";
import { loadProducts } from "../store/products";
import { payOrder, resetOrderPay } from "../store/orderPay";
import { deliverOrder, deleteOrderDeliver } from "../store/orderList";

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { id: orderId } = useParams();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const reduxState = useSelector((state) => state);

  const { order, loading, error } = reduxState.orderDetails;
  const { productsList: products } = reduxState.products;
  const { userInfo } = reduxState.user;
  const { success: orderPaid, loading: processingPayment } =
    reduxState.orderPay;
  const { success: orderDelivered, loading: processingDelivery } =
    reduxState.orderList.orderDeliver;

  useEffect(() => {
    dispatch(loadOrderDetails(orderId));
    dispatch(loadProducts("refresh-products"));
  }, [dispatch, orderId]);

  useEffect(() => {
    !userInfo.is_staff && navigate("/login");
    error && toast.error(error);
    if (orderPaid) {
      toast.success("Order marked as paid");
      dispatch(resetOrderPay());
      dispatch(loadOrderDetails(orderId));
    }
    if (orderDelivered) {
      toast.success("Order marked as delivered");
      dispatch(deleteOrderDeliver());
      dispatch(loadOrderDetails(orderId));
    }
  }, [navigate, orderId, order._id, orderPaid, orderDelivered, error]);

  const getPaymentExpired = (createdDate) => {
    //  payment expires after 48 hours (172800000 ms)
    return Date.now() - Date.parse(createdDate) > 172800000;
  };

  const getItemInStock = (itemId) => {
    const product = products?.find((product) => product._id === itemId);
    return product?.countInStock > 0;
  };

  const getItemsInStock = (items) => {
    let itemsInStock = true;

    items.forEach((item) => {
      const product = products?.find((product) => product._id === item.product);

      if (product?.countInStock <= 0) {
        itemsInStock = false;
        return;
      }
    });

    return itemsInStock;
  };

  const getChipData = () => {
    const isDelivered = order.isDelivered;
    const isPaid = order.isPaid;
    const paymentMethod = order.paymentMethod;
    const paymentExpired = getPaymentExpired(order.createdAt);
    const itemsInStock = getItemsInStock(order.orderItems);

    const label = isDelivered
      ? "Delivered"
      : paymentMethod === "cash" || (paymentMethod === "paypal" && isPaid)
      ? "Delivery in progress"
      : paymentMethod === "paypal" && !isPaid && !paymentExpired && itemsInStock
      ? "Waiting for payment"
      : "Canceled - Payment Failed";

    return label === "Delivered"
      ? { label, color: "success" }
      : label === "Delivery in progress"
      ? { label, color: "primary" }
      : label === "Waiting for payment"
      ? { label, color: "warning" }
      : { label, color: "default" };
  };

  const handleMarkAsPaid = () => {
    dispatch(payOrder(orderId, {}));
  };

  const handleMarkAsDelivered = () => {
    dispatch(deliverOrder(orderId));
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
        py: isMobile ? 2 : 3,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18 }}>
          Order Details
        </Typography>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" width="100%">
          <CircularProgress color="inherit" size={150} />
        </Box>
      ) : (
        <Box width="100%" sx={{ marginTop: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 530, fontSize: 16 }}>
            Order No: {order._id}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: 530, fontSize: 14, mb: 1 }}
          >
            User: {order.user?.first_name} {order.user?.last_name}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 14 }}>
            {order.orderItems?.length}{" "}
            {order.orderItems?.length > 1 ? "items" : "item"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 14 }}>
            Placed on {new Date(order.createdAt).toLocaleDateString("en-GB")}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 14 }}>
            Total: ${order.totalPrice}
          </Typography>

          <Chip label={getChipData().label} color={getChipData().color} />
          {getChipData().label === "Delivery in progress" && (
            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
              {order.paymentMethod === "cash" && !order.isPaid && (
                <LoadingButton
                  variant="outlined"
                  size="small"
                  loading={processingPayment}
                  onClick={handleMarkAsPaid}
                >
                  Mark as Paid
                </LoadingButton>
              )}

              <LoadingButton
                variant="outlined"
                size="small"
                loading={processingDelivery}
                onClick={handleMarkAsDelivered}
              >
                Mark as Delivered
              </LoadingButton>
            </Stack>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: 530, fontSize: 16 }}>
            Items in your order
          </Typography>

          {order.orderItems?.map((item) => (
            <Stack
              key={item._id}
              direction={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="center"
              display="flex"
              mb={1}
              ml={2}
            >
              <Box key={item._id} display="flex" alignItems="center">
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 1,
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 530, fontSize: 16 }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                    Quantity: {item.qty}
                  </Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                    Price: ${item.price}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          ))}

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={1}
            alignItems="start"
          >
            <Box
              border={1}
              borderColor="divider"
              borderRadius={1}
              p={1}
              width={isMobile ? "100%" : "50%"}
            >
              <Typography variant="h6" sx={{ fontWeight: 530, fontSize: 16 }}>
                Payment Information
              </Typography>
              <Divider sx={{ mb: 1, mx: -1 }} />
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                Payment Method:{" "}
                {order.paymentMethod === "paypal"
                  ? "PayPal"
                  : "Cash On Delivery"}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                Payment Status: {order.isPaid ? "Paid" : "Not Paid"}
              </Typography>

              {order.isPaid && (
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, fontSize: 14 }}
                >
                  Paid on {new Date(order.paidAt).toLocaleDateString("en-GB")}
                </Typography>
              )}

              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 14, mt: 2 }}
              >
                Items Amount: $
                {order.orderItems
                  ?.reduce((acc, item) => acc + item.price * item.qty, 0)
                  .toFixed(2)}
              </Typography>

              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                Shipping Fee: ${order.shippingPrice}
              </Typography>

              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                Tax: ${order.taxPrice}
              </Typography>

              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                Total: ${order.totalPrice}
              </Typography>
            </Box>

            <Box
              border={1}
              borderColor="divider"
              borderRadius={1}
              p={1}
              width={isMobile ? "100%" : "50%"}
            >
              <Typography variant="h6" sx={{ fontWeight: 530, fontSize: 16 }}>
                Shipping Information
              </Typography>

              <Divider sx={{ mb: 1, mx: -1 }} />

              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                Shipping Status:{" "}
                {order.isDelivered ? "Delivered" : "Not Delivered"}
              </Typography>

              {order.isDelivered && (
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, fontSize: 14 }}
                >
                  Delivered on{" "}
                  {new Date(order.deliveredAt).toLocaleDateString("en-GB")}
                </Typography>
              )}

              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 14, mt: 2 }}
              >
                Name: {order?.shippingAddress?.address?.first_name}{" "}
                {order?.shippingAddress?.address?.last_name}
              </Typography>

              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                Phone: {order?.shippingAddress?.address?.phone_number}
              </Typography>

              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                Address: {order?.shippingAddress?.address?.address}
                {" - "}
                {order?.shippingAddress?.address?.city}{" "}
                {order?.shippingAddress?.address?.postal_code},{" "}
                {order?.shippingAddress?.address?.country}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Order;
