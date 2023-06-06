import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Chip,
  Button,
  Typography,
  Tabs,
  Tab,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { OrderItemSkeleton } from "./Skeletons";

import { loadUserOrders } from "../store/userOrders";
import { loadProducts } from "../store/products";
import { clearError } from "../store/orderDetails";

import { orderImageUrl } from "../utils/imageUrls";

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [tabValue, setTabValue] = useState(0);

  const { orders, loading } = useSelector((state) => state.userOrders);
  const { productsList: products } = useSelector((state) => state.products);
  const { error } = useSelector((state) => state.orderDetails);

  const getPaymentExpired = (createdDate) => {
    //  payment expires after 48 hours (172800000 ms)
    return Date.now() - Date.parse(createdDate) > 172800000;
  };

  const getItemsInStock = (order) => {
    let itemsInStock = true;

    order.orderItems.forEach((item) => {
      const product = products?.find((product) => product._id === item.product);

      if (product?.countInStock <= 0) {
        itemsInStock = false;
        return;
      }
    });

    return itemsInStock;
  };

  // sort newest to oldest
  const sortedOrders = [...orders].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );

  const openOrders = sortedOrders.filter(
    (order) =>
      order.paymentMethod === "cash" ||
      (order.paymentMethod === "paypal" && order.isPaid) ||
      (order.paymentMethod === "paypal" &&
        !order.isPaid &&
        !getPaymentExpired(order.createdAt) &&
        getItemsInStock(order))
  );

  const closedOrders = sortedOrders.filter(
    (order) =>
      (order.paymentMethod === "paypal" &&
        !order.isPaid &&
        getPaymentExpired(order.createdAt)) ||
      (order.paymentMethod === "paypal" &&
        !order.isPaid &&
        !getItemsInStock(order))
  );

  const ordersToDisplay = tabValue === 0 ? openOrders : closedOrders;

  const getChipData = (order) => {
    const isDelivered = order.isDelivered;
    const isPaid = order.isPaid;
    const paymentMethod = order.paymentMethod;
    const paymentExpired = getPaymentExpired(order.createdAt);
    const itemsInStock = getItemsInStock(order);

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

  useEffect(() => {
    dispatch(loadUserOrders());
    dispatch(loadProducts("refresh-products"));

    error && dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      {!isMobile && (
        <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18 }}>
          Orders
        </Typography>
      )}

      <Tabs
        value={tabValue}
        textColor="inherit"
        sx={{
          borderBottom: "1px solid #e0e0e0",
          "& .MuiTabs-indicator": { backgroundColor: "#000" },
          "& .Mui-selected": { color: "#000" },
          "& .MuiTab-root": {
            padding: 0,
            marginRight: 2,
            "&:hover": { color: "#000", opacity: 1 },
          },
        }}
        onChange={handleChange}
      >
        <Tab label={`Open Orders (${openOrders.length})`} />
        <Tab label={`Closed Orders (${closedOrders.length})`} />
      </Tabs>
      {loading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <OrderItemSkeleton key={index} isMobile={isMobile} />
        ))
      ) : ordersToDisplay.length === 0 ? (
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <img
            src={orderImageUrl}
            alt="No Orders"
            width="200px"
            height="200px"
          />
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ fontWeight: 520, fontSize: 16, mt: 2 }}
          >
            You do not have any {tabValue === 0 ? "open" : "closed"} orders.
          </Typography>

          {tabValue === 0 && (
            <Button
              variant="contained"
              color="inherit"
              sx={{ mt: 2 }}
              onClick={() => navigate("/")}
            >
              Start Shopping
            </Button>
          )}
        </Box>
      ) : (
        ordersToDisplay.map((order) => (
          <Box
            key={order._id}
            border={1}
            borderColor="divider"
            borderRadius={2}
            p={isMobile ? 1 : 2}
            mt={1}
            sx={isMobile ? { cursor: "pointer" } : {}}
            onClick={() => navigate(`/profile/orders/${order._id}`)}
          >
            <Stack
              direction="row"
              alignItems="center"
              width="100%"
              height="fit-content"
              spacing={1}
            >
              <img
                src={order.orderItems[0].image}
                alt={order.orderItems[0].name}
                style={{ minHeight: "60px" }}
                width={isMobile ? "20%" : "10%"}
                height="100%"
                loading="lazy"
              />

              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                width="100%"
                height="100%"
              >
                <Stack direction="column" height="100%">
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ fontSize: isMobile ? 13 : 18, fontWeight: 500 }}
                  >
                    {order.orderItems[0].name}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      fontSize: isMobile ? 11 : 14,
                      fontWeight: 450,
                      mb: 1,
                    }}
                  >
                    Order No: {order._id}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Chip
                      label={getChipData(order).label}
                      color={getChipData(order).color}
                      size="small"
                      sx={{ width: "fit-content" }}
                    />
                  </Stack>

                  {order.isDelivered && (
                    <Typography
                      variant="body2"
                      sx={{ fontSize: isMobile ? 11 : 14, fontWeight: 450 }}
                    >
                      On{" "}
                      {new Date(order.deliveredAt).toLocaleDateString("en-GB")}
                    </Typography>
                  )}

                  {getChipData(order).label === "Waiting for payment" && (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1, width: "150px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/pay/${order._id}`);
                      }}
                    >
                      Pay Now
                    </Button>
                  )}
                </Stack>
                {!isMobile && (
                  <Button
                    color="inherit"
                    sx={{ fontWeight: 550, alignSelf: "start", mt: -1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/orders/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                )}
              </Box>
            </Stack>
          </Box>
        ))
      )}
    </>
  );
};

export default Orders;
