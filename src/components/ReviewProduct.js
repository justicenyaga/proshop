import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Divider,
  Typography,
  CircularProgress,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
  Rating,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

import {
  getProductDetails,
  reviewProduct,
  resetProductReview,
} from "../store/productDetails";
import { loadUserOrders } from "../store/userOrders";
import { loadUserReviews } from "../store/userReviews";

const ReviewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { section: productId } = useParams();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingHover, setRatingHover] = useState(-1);

  const ratingMessages = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const reduxState = useSelector((state) => state);
  const {
    product,
    loading: loadingProduct,
    error,
    successReview,
    loadingReview,
    errorReview,
  } = reduxState.productDetails;
  const { orders, loading: loadingOrders } = reduxState.userOrders;
  const { userReviews, loading: loadingReviews } = reduxState.userReviews;

  const deliveredOrders = orders?.filter((order) => order.isDelivered);

  const productInDeliveredItems = deliveredOrders?.some((order) =>
    order.orderItems.some((item) => item.product === Number(productId))
  );

  const productAlreadyReviewed = userReviews?.some(
    (review) => review.product === Number(productId)
  );

  useEffect(() => {
    dispatch(getProductDetails(productId));
    dispatch(loadUserOrders());
    dispatch(loadUserReviews());
  }, [dispatch, productId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate("/profile/reviews");
    }

    if (product._id && orders.length && !productInDeliveredItems) {
      toast.error("You are not eligible to review this product");
      navigate("/profile/reviews");
    }

    if (productAlreadyReviewed) {
      toast.error("You have already reviewed this product");
      navigate("/profile/reviews");
    }

    if (successReview) {
      toast.success("Review submitted successfully");
      navigate("/profile/reviews");
      dispatch(resetProductReview());
    }

    errorReview && toast.error(errorReview);
  }, [dispatch, navigate, error, product, orders, successReview, errorReview]);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleRatingHover = (event, value) => {
    setRatingHover(value);
  };

  function getLabelText(value) {
    return `${value} Heart${value !== 1 ? "s" : ""}`;
  }

  const handleSubmitReview = () => {
    if (!name) {
      toast.error("Please enter your name");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    const review = { name, rating, comment };
    dispatch(reviewProduct(productId, review));
  };

  return (
    <>
      {!isMobile && (
        <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18 }}>
          Review Product
        </Typography>
      )}

      {loadingProduct || loadingOrders || loadingReviews ? (
        <Box display="flex" justifyContent="center" width="100%">
          <CircularProgress color="inherit" size={150} />
        </Box>
      ) : (
        <>
          <TextField
            label="Your name"
            value={name}
            size="small"
            sx={{ width: "300px", mt: 1, maxWidth: "100%" }}
            onChange={(e) => setName(e.target.value)}
            fullWidth={isMobile}
          />

          <Typography
            variant="h6"
            textAlign="center"
            width="fit-content"
            sx={{ fontWeight: 520, fontSize: 14, mt: 2 }}
          >
            Select the stars to rate the product
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" spacing={1}>
            <img src={product?.image} alt={product?.name} width="100" />
            <Stack spacing={1}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 14 }}
              >
                {product?.name}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                width="100%"
                alignItems="center"
              >
                <Rating
                  name="rating"
                  size="large"
                  value={rating}
                  getLabelText={getLabelText}
                  onChange={handleRatingChange}
                  onChangeActive={handleRatingHover}
                />

                {(rating || ratingHover > 0) && (
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 520, fontSize: 14 }}
                  >
                    {ratingMessages[ratingHover !== -1 ? ratingHover : rating]}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>

          <TextField
            label="Comment"
            value={comment}
            size="small"
            InputProps={{ multiline: true, rows: 4 }}
            sx={{ mt: 2 }}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
          />

          <LoadingButton
            variant="contained"
            color="inherit"
            sx={{ mt: 2 }}
            onClick={handleSubmitReview}
            fullWidth
            loading={loadingReview}
          >
            Submit Review
          </LoadingButton>
        </>
      )}
    </>
  );
};

export default ReviewProduct;
