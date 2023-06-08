import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  CircularProgress,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { OrderItemSkeleton } from "./Skeletons";

import { loadUserOrders } from "../store/userOrders";
import { loadUserReviews } from "../store/userReviews";

import { commentImageUrl } from "../utils/imageUrls";

const PendingReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const reduxState = useSelector((state) => state);
  const { orders, loading: loadingOrders } = reduxState.userOrders;
  const { userReviews, loading: loadingReviews } = reduxState.userReviews;

  const deliveredOrders = orders?.filter((order) => order.isDelivered);
  const pendingReviews = [];

  deliveredOrders?.forEach((order) => {
    order.orderItems.forEach((item) => {
      if (
        !userReviews.some((review) => review.product === item.product) &&
        !pendingReviews.some((itm) => itm.product === item.product)
      ) {
        const reviewItem = {
          ...item,
          order: order._id,
          deliveredOn: order.deliveredAt,
        };
        pendingReviews.push(reviewItem);
      }
    });
  });

  useEffect(() => {
    dispatch(loadUserOrders());
    dispatch(loadUserReviews());
  }, [dispatch]);

  return (
    <>
      {!isMobile && (
        <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18 }}>
          Pending Reviews
        </Typography>
      )}

      {loadingOrders || loadingReviews ? (
        Array.from({ length: 3 }).map((_, index) => (
          <OrderItemSkeleton key={index} isMobile={isMobile} />
        ))
      ) : pendingReviews.length === 0 ? (
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <img
            src={commentImageUrl}
            alt="No pending reviews"
            width="200px"
            height="200px"
          />
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ fontWeight: 520, fontSize: 16, mt: 2 }}
          >
            You do not have any pending reviews.
          </Typography>
        </Box>
      ) : (
        pendingReviews.map((item) => (
          <Box
            key={item.product}
            border={1}
            borderColor="divider"
            borderRadius={2}
            p={isMobile ? 1 : 2}
            mt={1}
            sx={isMobile ? { cursor: "pointer" } : {}}
            onClick={
              isMobile
                ? () => navigate(`/profile/reviews/${item.product}`)
                : null
            }
          >
            <Stack
              direction="row"
              alignItems="center"
              width="100%"
              height="fit-content"
              spacing={1}
            >
              <img
                src={item.image}
                alt={item.name}
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
                    sx={{ fontSize: isMobile ? 12 : 16, fontWeight: 500 }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      fontSize: isMobile ? 11 : 14,
                      fontWeight: 450,
                      mt: 3,
                    }}
                  >
                    Order No: {item.order}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      fontSize: isMobile ? 11 : 14,
                      fontWeight: 450,
                      color: "success.main",
                    }}
                  >
                    Delivered On:{" "}
                    {new Date(item.deliveredOn).toLocaleDateString("en-GB")}
                  </Typography>
                </Stack>
                {!isMobile && (
                  <Button
                    color="inherit"
                    sx={{ fontWeight: 550, alignSelf: "start", mt: -1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/reviews/${item.product}`);
                    }}
                  >
                    Rate Product
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

export default PendingReviews;
