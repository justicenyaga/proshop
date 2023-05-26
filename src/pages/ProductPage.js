import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Breadcrumbs,
  Typography,
  Stack,
  Card,
  Rating,
  List,
  Alert,
  Button,
  IconButton,
  ListItem,
  Box,
  TextField,
  CircularProgress,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ReviewStar from "../components/ReviewStar";
import { ProductPageSkeleton } from "../components/Skeletons";

import { addItemToCart, removeCartItem } from "../store/cart";
import { getProductDetails } from "../store/productDetails";

import { commentImageUrl } from "../utils/imageUrls";

const CustomLink = styled(Link)({
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    textDecoration: "underline",
  },
});

const ProductPage = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { id: productId } = useParams();

  const [quantity, setQuantity] = useState(1);

  const [quantityLoading, setQuantityLoading] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const reduxState = useSelector((state) => state);

  const { product, loading, error } = reduxState.productDetails;
  const { cartItems } = reduxState.cart;

  const productExistsInCart = cartItems.find(
    (product) => product.productId === Number(productId)
  );

  const productStock = product?.countInStock;

  const category_slug = product?.category?.cat_slug;
  const sub_category_slug = product?.category?.slug;
  const category_name = product?.category?.name;
  const sub_category_name = product?.category?.sub_category;

  const allReviews = product?.reviews;
  let starRatings = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  allReviews.length > 0 &&
    allReviews.forEach((review) => {
      starRatings[review.rating] += 1;
    });

  const reviews_with_comments = allReviews
    .filter((review) => review.comment !== "")
    .sort((a, b) => b._id - a._id);

  const latest_reviews = [...reviews_with_comments]?.slice(0, 3);

  const reviews = showAllReviews ? reviews_with_comments : latest_reviews;

  useEffect(() => {
    dispatch(getProductDetails(productId));

    if (productExistsInCart) setQuantity(Number(productExistsInCart.quantity));
  }, [dispatch, productId]);

  const handleQuantityChange = (e) => {
    const qty = Number(e.target.value);
    if (qty < 1) {
      setQuantity(1);
    } else if (qty > productStock) {
      setQuantity(productStock);
    } else {
      setQuantity(qty);
    }
  };

  const handleAddToCart = () => {
    dispatch(addItemToCart(productId, quantity));
    toast.success("Item added to cart");
  };

  const handleIncrement = (event) => {
    setQuantityLoading(true);
    setTimeout(() => {
      setQuantityLoading(false);
    }, 800);

    const quantity = productExistsInCart.quantity + 1;
    if (quantity > productStock) {
      toast.info("Product out of stock");
      return;
    }
    dispatch(addItemToCart(product._id, quantity));
    setQuantity(quantity);
    toast.success("Item added to cart");
  };

  const handleDecrement = (event) => {
    setQuantityLoading(true);
    setTimeout(() => {
      setQuantityLoading(false);
    }, 800);

    const quantity = productExistsInCart.quantity - 1;
    if (quantity === 0) {
      dispatch(removeCartItem(product._id));
      setQuantity(1);
      toast.success("Product removed from cart");
    } else {
      dispatch(addItemToCart(product._id, quantity));
      setQuantity(quantity);
      toast.success("Item quantity updated");
    }
  };

  const handleToggleShowReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  return (
    <>
      {loading ? (
        <ProductPageSkeleton />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {!showAllReviews && (
            <>
              {isDesktop && (
                <Breadcrumbs
                  aria-label="breadcrumb"
                  sx={{ mb: 2 }}
                  separator={<NavigateNextIcon fontSize="small" />}
                >
                  <CustomLink to="/">Home</CustomLink>
                  <CustomLink to={`/${category_slug}`}>
                    {category_name}
                  </CustomLink>
                  <CustomLink to={`/${category_slug}/${sub_category_slug}`}>
                    {sub_category_name}
                  </CustomLink>
                  <Typography color="text.primary">{product.name}</Typography>
                </Breadcrumbs>
              )}

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  width={{ xs: "100%", md: "75%" }}
                  borderRadius="5px"
                  bgcolor="white"
                  p={2}
                >
                  <Box width={{ xs: "100%", md: "40%" }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ maxWidth: "100%" }}
                    />
                  </Box>
                  <Stack
                    spacing={2}
                    width={{ xs: "100%", md: "60%" }}
                    mt={{ xs: 2, md: 0 }}
                  >
                    <Typography variant="h4" component="div">
                      {product.name}
                    </Typography>

                    <Typography variant="body1" component="p">
                      Brand: {product.brand}
                    </Typography>

                    <Stack
                      spacing={0.5}
                      my={1}
                      direction="row"
                      alignItems="center"
                    >
                      <Rating
                        value={Number(product.rating)}
                        size={isDesktop ? "medium" : "small"}
                        precision={0.1}
                        readOnly
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={14}
                      >
                        (
                        {product.numReviews > 0
                          ? `${product.numReviews} ${
                              product.numReviews === 1 ? "review" : "reviews"
                            }`
                          : `No reviews yet`}
                        )
                      </Typography>
                    </Stack>

                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ fontSize: 26, fontWeight: 550 }}
                      component="h6"
                    >
                      ${product.price}
                    </Typography>

                    <Typography
                      variant="body1"
                      component="p"
                      sx={{ fontSize: 15, color: "royalblue" }}
                    >
                      {productStock > 0
                        ? `${productStock} ${
                            productStock === 1 ? "item" : "items"
                          } left in stock`
                        : "Out of stock"}
                    </Typography>

                    <Typography variant="body1" component="p">
                      Description: {product.description}
                    </Typography>
                  </Stack>
                </Stack>

                {isDesktop && (
                  <List
                    component={Paper}
                    sx={{
                      bgcolor: "white",
                      borderRadius: "5px",
                      width: "25%",
                      height: "fit-content",
                    }}
                    disablePadding
                  >
                    <ListItem>
                      <Stack direction="row" alignItems="center" width="100%">
                        <Typography
                          variant="body2"
                          component="div"
                          width="50%"
                          sx={{ fontSize: 16, fontWeight: 600 }}
                        >
                          Status:
                        </Typography>

                        <Typography
                          variant="body2"
                          component="div"
                          width="50%"
                          sx={{ fontSize: 16, fontWeight: 500 }}
                        >
                          {productStock > 0 ? "In Stock" : "Out of Stock"}
                        </Typography>
                      </Stack>
                    </ListItem>

                    <Divider />

                    <ListItem>
                      <Stack direction="row" alignItems="center" width="100%">
                        <Typography
                          variant="body2"
                          component="div"
                          width="50%"
                          sx={{ fontSize: 16, fontWeight: 600 }}
                        >
                          Unit Price:
                        </Typography>

                        <Typography
                          variant="body2"
                          component="div"
                          width="50%"
                          sx={{ fontSize: 16, fontWeight: 500 }}
                        >
                          ${product.price}
                        </Typography>
                      </Stack>
                    </ListItem>

                    <Divider />

                    {!productExistsInCart && (
                      <>
                        <ListItem>
                          <Stack
                            direction="row"
                            alignItems="center"
                            width="100%"
                          >
                            <Typography
                              variant="body2"
                              component="div"
                              width="50%"
                              sx={{ fontSize: 16, fontWeight: 600 }}
                            >
                              Quantity:
                            </Typography>

                            <TextField
                              type="number"
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              disabled={product.countInStock === 0}
                              size="small"
                              value={quantity}
                              onChange={handleQuantityChange}
                              sx={{ width: "50%" }}
                            />
                          </Stack>
                        </ListItem>

                        <Divider />
                      </>
                    )}

                    <ListItem
                      sx={{
                        justifyContent: "center",
                      }}
                    >
                      {productExistsInCart ? (
                        <Box
                          width="90%"
                          sx={{
                            marginTop: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="inherit"
                            sx={{
                              flex: "0 0 10%",
                              minWidth: "30px",
                              "&:disabled": {
                                cursor: "not-allowed",
                                pointerEvents: "auto",
                              },
                            }}
                            onClick={handleDecrement}
                            disabled={quantityLoading}
                          >
                            <RemoveIcon fontSize="small" />
                          </Button>
                          <Typography
                            variant="body2"
                            align="center"
                            sx={{ width: "80%" }}
                          >
                            {quantityLoading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              productExistsInCart.quantity
                            )}
                          </Typography>
                          <Button
                            variant="contained"
                            color="inherit"
                            sx={{
                              flex: "0 0 10%",
                              minWidth: "30px",
                              "&:disabled": {
                                cursor: "not-allowed",
                                pointerEvents: "auto",
                              },
                            }}
                            onClick={handleIncrement}
                            disabled={
                              quantityLoading || productStock === quantity
                            }
                          >
                            <AddIcon fontSize="small" />
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          variant="contained"
                          color="inherit"
                          fullWidth
                          disabled={productStock === 0}
                          sx={{
                            "&:disabled": {
                              cursor: "not-allowed",
                              pointerEvents: "auto",
                            },
                          }}
                          onClick={handleAddToCart}
                          endIcon={<AddShoppingCartIcon />}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </ListItem>

                    {productExistsInCart && (
                      <>
                        <Divider />

                        <ListItem>
                          <Stack
                            direction="row"
                            alignItems="center"
                            width="100%"
                          >
                            <Typography
                              variant="body2"
                              component="div"
                              width="50%"
                              sx={{ fontSize: 16, fontWeight: 600 }}
                            >
                              Total Cost:
                            </Typography>

                            <Typography
                              variant="body2"
                              component="div"
                              width="50%"
                              sx={{ fontSize: 16, fontWeight: 500 }}
                            >
                              ${(product.price * quantity).toFixed(2)}
                            </Typography>
                          </Stack>
                        </ListItem>
                      </>
                    )}
                  </List>
                )}
              </Stack>

              {!isDesktop && (
                <Typography
                  variant="body1"
                  component="p"
                  sx={{ fontSize: 16, fontWeight: 500, mt: 2 }}
                >
                  Customer Feedback
                </Typography>
              )}
            </>
          )}

          {showAllReviews && (
            <Box
              sx={{ bgcolor: "white", width: "100%" }}
              component={Card}
              elevation={5}
              display="flex"
              flexDirection="row"
              alignItems="center"
              mb={2}
            >
              <IconButton onClick={handleToggleShowReviews}>
                <ArrowBackIcon fontSize="large" />
              </IconButton>

              <Typography
                variant="body2"
                fontWeight={500}
                fontSize={18}
                color="text.primary"
              >
                Customer Feedback
              </Typography>
            </Box>
          )}

          <Box
            mt={showAllReviews ? 0 : 2}
            width={!isDesktop || showAllReviews ? "100%" : "74%"}
            p={isDesktop ? 2 : 0.8}
            borderRadius="5px"
            bgcolor="white"
          >
            {isDesktop
              ? !showAllReviews && (
                  <Stack
                    direction="row"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 550,
                        fontSize: isDesktop ? 18 : 16,
                      }}
                      component="div"
                    >
                      Customer Feedback
                    </Typography>

                    {allReviews.length > 0 && isDesktop && (
                      <Button
                        color="inherit"
                        size="medium"
                        endIcon={<ExpandMoreIcon fontSize="small" />}
                        onClick={handleToggleShowReviews}
                      >
                        See all
                      </Button>
                    )}
                  </Stack>
                )
              : allReviews.length > 0 &&
                !showAllReviews && (
                  <Stack
                    direction="row"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={1}
                    pr={2.8}
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={handleToggleShowReviews}
                  >
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="body2" fontSize={14}>
                        Product Rating & Comments
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          width="fit-content"
                          height="20px"
                          border={1}
                          borderColor="#ffc107"
                          alignItems="center"
                          display="flex"
                          justifyContent="center"
                          p={0.5}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: 11,
                              color: "#ffc107",
                            }}
                          >
                            <strong>{Number(product.rating).toFixed(1)}</strong>
                            /5
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: 14,
                          }}
                        >
                          {`${product.numReviews} verified ${
                            product.numReviews === 1 ? "rating" : "ratings"
                          }`}
                        </Typography>
                      </Stack>
                    </Stack>
                    <ExpandMoreIcon fontSize="small" />
                  </Stack>
                )}

            {!showAllReviews && allReviews.length > 0 && (
              <Divider sx={{ mx: isDesktop ? -2 : -0.8 }} />
            )}

            {allReviews.length > 0 ? (
              <Stack
                mt={!isDesktop || showAllReviews ? 1 : 2}
                spacing={isDesktop ? 2 : 1}
                direction={isDesktop ? "row" : "column"}
              >
                {!isDesktop && showAllReviews && (
                  <Typography variant="subtitle2" ml={1} fontSize={16}>
                    Rating ({allReviews.length})
                  </Typography>
                )}

                {(isDesktop || showAllReviews) && (
                  <Stack
                    direction={isDesktop ? "column" : "row"}
                    width={isDesktop ? "25%" : "100%"}
                    p={0.5}
                    spacing={2}
                  >
                    {isDesktop && (
                      <Typography variant="subtitle2" fontSize={16}>
                        Rating ({allReviews.length})
                      </Typography>
                    )}
                    <Box
                      sx={{
                        mt: isDesktop ? 1 : 0,
                        p: isDesktop ? 2 : 0.8,
                        width: isDesktop ? "100%" : "50%",
                        minWidth: "140px",
                        borderRadius: "5px",
                        boxShadow: 2,
                        bgcolor: grey[300],
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      elevation={2}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: "#ffc107",
                        }}
                      >
                        {Number(product.rating).toFixed(1)}/5
                      </Typography>

                      <Rating
                        value={Number(product.rating)}
                        color="#ffc107"
                        precision={0.1}
                        sx={{ my: 2 }}
                        size={isDesktop ? "medium" : "small"}
                        readOnly
                      />

                      <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {`${product.numReviews} verified ${
                          product.numReviews === 1 ? "rating" : "ratings"
                        }`}
                      </Typography>
                    </Box>

                    <Box width="100%" mt={isDesktop ? 1 : 0}>
                      <Stack direction="column" mt={1} alignItems="center">
                        <ReviewStar
                          starValue={5}
                          starReviews={Number(starRatings[5])}
                          totalReviews={allReviews.length}
                        />
                        <ReviewStar
                          starValue={4}
                          starReviews={Number(starRatings[4])}
                          totalReviews={allReviews.length}
                        />
                        <ReviewStar
                          starValue={3}
                          starReviews={Number(starRatings[3])}
                          totalReviews={allReviews.length}
                        />
                        <ReviewStar
                          starValue={2}
                          starReviews={Number(starRatings[2])}
                          totalReviews={allReviews.length}
                        />
                        <ReviewStar
                          starValue={1}
                          starReviews={Number(starRatings[1])}
                          totalReviews={allReviews.length}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                )}
                <Box width={isDesktop ? "75%" : "100%"} p={isDesktop ? 0.5 : 0}>
                  {((showAllReviews && allReviews.length > 0) || isDesktop) && (
                    <Typography variant="subtitle2" mb={1} fontSize={16}>
                      Comments ({reviews_with_comments.length})
                    </Typography>
                  )}

                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <Box
                        key={review._id}
                        sx={{
                          p: 2,
                          mb: 0.8,
                          width: "100%",
                          height: "fit-content",
                          borderRadius: "5px",
                          boxShadow: 2,
                          bgcolor: grey[300],
                        }}
                        elevation={2}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: 15,
                              fontWeight: 550,
                            }}
                          >
                            {review.name}
                          </Typography>

                          <Rating
                            value={review.rating}
                            color="#ffc107"
                            size={isDesktop ? "medium" : "small"}
                            readOnly
                          />
                        </Stack>

                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {review.comment}
                        </Typography>

                        <Stack
                          direction="row"
                          alignItems="center"
                          mt={2}
                          mb={-1}
                          display="flex"
                          justifyContent="space-between"
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          >
                            {review.createdAt.substring(0, 10)}
                          </Typography>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            display="flex"
                          >
                            <TaskAltIcon color="success" fontSize="small" />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: 12,
                                color: "success.main",
                                fontWeight: 500,
                              }}
                            >
                              Verified Purchase
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    ))
                  ) : (
                    <Stack
                      direction="column"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="150px"
                    >
                      <img
                        src={commentImageUrl}
                        height="100px"
                        width="100px"
                        loading="lazy"
                        alt="no comment"
                      />

                      <Typography
                        variant="body2"
                        sx={{ fontSize: 16, fontWeight: 500 }}
                        textAlign="center"
                      >
                        This product has no comments yet
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Stack>
            ) : (
              <Stack
                direction="column"
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="150px"
              >
                <img
                  src={commentImageUrl}
                  height="100px"
                  width="100px"
                  loading="lazy"
                  alt="no comment"
                />

                <Typography
                  variant="body2"
                  sx={{ fontSize: 16, fontWeight: 500 }}
                  textAlign="center"
                >
                  This product has no reviews yet
                </Typography>
              </Stack>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default ProductPage;
