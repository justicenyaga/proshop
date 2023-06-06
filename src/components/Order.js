import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CircularProgress,
  Button,
  Chip,
  Typography,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";

import { loadOrderDetails, clearError } from "../store/orderDetails";
import { loadProducts } from "../store/products";
import { addItemToCart, clearCart } from "../store/cart";
import { resetOrder } from "../store/order";

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { section: orderId } = useParams();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const reduxState = useSelector((state) => state);
  const { success: orderCreated } = reduxState.order;
  const { order, loading, error } = reduxState.orderDetails;
  const { productsList: products } = reduxState.products;

  useEffect(() => {
    orderCreated && dispatch(clearCart()) && dispatch(resetOrder());
    dispatch(loadOrderDetails(orderId));
    dispatch(loadProducts("refresh-products"));
  }, [dispatch, orderCreated]);

  useEffect(() => {
    if (error === "You are not authorized to view this order") {
      toast.error(error);
      navigate("/profile/orders");
      dispatch(clearError());
    } else {
      error && toast.error(error) && navigate("/profile/orders");
    }
  }, [error, navigate, orderId, order._id]);

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

  const handleBuyAgain = (productId) => {
    dispatch(addItemToCart(productId, 1));
    navigate("/cart");
  };

  return (
    <>
      {!isMobile && (
        <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18 }}>
          Order Details
        </Typography>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" width="100%">
          <CircularProgress color="inherit" size={150} />
        </Box>
      ) : (
        <Box width="100%" sx={{ marginTop: 1 }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 530, fontSize: 16, mb: 0.8 }}
          >
            Order No: {order._id}
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

          <Stack direction="row" spacing={2} alignItems="center" mt={1}>
            <Chip label={getChipData().label} color={getChipData().color} />
            {getChipData().label === "Waiting for payment" && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/pay/${order._id}`)}
              >
                Pay Now
              </Button>
            )}
          </Stack>

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
              {getItemInStock(item.product) && (
                <Button
                  variant="contained"
                  color="inherit"
                  fullWidth={isMobile}
                  size={isMobile ? "medium" : "small"}
                  sx={isMobile ? { mt: 1 } : { alignSelf: "start" }}
                  onClick={() => handleBuyAgain(item.product)}
                >
                  Buy Again
                </Button>
              )}
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
    </>
  );
};

export default Order;
