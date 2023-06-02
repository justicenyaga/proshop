import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme, useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  Stack,
  Box,
  List,
  ListItem,
  CircularProgress,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "react-toastify";

import { addItemToCart, removeCartItem } from "../store/cart";

import { cartImageUrl } from "../utils/imageUrls";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const cartSlice = useSelector((state) => state.cart);
  const { cartItems } = cartSlice;

  const [cartItemQuantities, setCartItemQuantities] = useState({});
  const [quantityLoading, setQuantityLoading] = useState({});
  const [itemsStock, setItemsStock] = useState({});

  useEffect(() => {
    const cartItemQuantities = {};
    const quantityLoading = {};
    const itemsStock = {};

    cartItems?.forEach((item) => {
      cartItemQuantities[item.productId] = item.quantity;
      quantityLoading[item.productId] = false;
      itemsStock[item.productId] = item.countInStock;
    });

    setCartItemQuantities(cartItemQuantities);
    setQuantityLoading(quantityLoading);
    setItemsStock(itemsStock);
  }, [cartItems]);

  const totalItemsInCart = cartItems?.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const subTotalPrice = cartItems
    ?.reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const handleRemoveCartItem = (id) => {
    dispatch(removeCartItem(id));
  };

  const handleToCheckout = () => {
    navigate("/login?redirect=shipping-address");
  };

  const handleIncrement = async (itemId) => {
    const qtyLoading = { ...quantityLoading };
    qtyLoading[itemId] = true;
    setQuantityLoading(qtyLoading);

    setTimeout(() => {
      qtyLoading[itemId] = false;
      setQuantityLoading(qtyLoading);
    }, 800);

    let quantity = cartItemQuantities[itemId];
    quantity += 1;

    if (quantity > itemsStock[itemId]) {
      toast.info("Product out of stock");
      return;
    }

    dispatch(addItemToCart(itemId, quantity));
    toast.success("Item added to cart");
  };

  const handleDecrement = (itemId) => {
    const qtyLoading = { ...quantityLoading };
    qtyLoading[itemId] = true;
    setQuantityLoading(qtyLoading);

    setTimeout(() => {
      qtyLoading[itemId] = false;
      setQuantityLoading(qtyLoading);
    }, 800);

    let quantity = cartItemQuantities[itemId];
    quantity -= 1;

    if (quantity === 0) return;
    else {
      dispatch(addItemToCart(itemId, quantity));
      toast.success("Item quantity updated");
    }
  };

  return cartItems.length === 0 ? (
    <Stack
      direction="column"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="50vh"
    >
      <img
        src={cartImageUrl}
        height="100px"
        width="100px"
        loading="lazy"
        alt="cart"
        style={{
          borderRadius: "50%",
        }}
      />

      <Typography
        variant="body2"
        my={3}
        sx={{ fontSize: 20, fontWeight: 500 }}
        textAlign="center"
      >
        Your cart is empty!
      </Typography>

      <Button
        variant="contained"
        component={Link}
        to="/"
        sx={{ fontWeight: 550, width: isMobile ? "80%" : "250px" }}
        color="inherit"
      >
        Start Shopping
      </Button>
    </Stack>
  ) : (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
      <Stack
        direction="column"
        width={{ xs: "100%", md: "75%" }}
        borderRadius="5px"
      >
        <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 550 }}>
          Cart ({totalItemsInCart})
        </Typography>

        <List>
          {cartItems.map((item) => (
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
                        sx={{ fontSize: isMobile ? 13 : 18, fontWeight: 520 }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ fontSize: isMobile ? 12 : 18, fontWeight: 520 }}
                      >
                        ${item.price}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      component="div"
                      sx={{ fontSize: isMobile ? 10 : 15, color: "royalblue" }}
                    >
                      {item.countInStock} units in stock
                    </Typography>
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    marginTop: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    color="inherit"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleRemoveCartItem(item.productId)}
                    size="small"
                  >
                    Remove
                  </Button>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: isMobile ? "40%" : "30%",
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
                      size="small"
                      onClick={() => handleDecrement(item.productId)}
                      disabled={
                        quantityLoading[item.productId] || item.quantity === 1
                      }
                    >
                      <RemoveIcon fontSize="small" />
                    </Button>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{ flex: "1 1 80%" }}
                    >
                      {quantityLoading[String(item.productId)] ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        cartItemQuantities[item.productId]
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
                      size="small"
                      onClick={() => handleIncrement(item.productId)}
                      disabled={
                        quantityLoading[String(item.productId)] ||
                        item.quantity === item.countInStock
                      }
                    >
                      <AddIcon fontSize="small" />
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Stack>

      <Stack direction="column" width={{ xs: "100%", md: "25%" }}>
        <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 550 }}>
          Summary
        </Typography>

        <Stack
          direction="column"
          mt={0.8}
          borderRadius="5px"
          bgcolor="white"
          p={2}
        >
          <Stack direction="row" alignItems="center" width="100%">
            <Typography
              variant="body2"
              component="div"
              width="50%"
              sx={{ fontSize: 16, fontWeight: 550 }}
            >
              Sub Total:
            </Typography>

            <Typography
              variant="body2"
              component="div"
              width="50%"
              sx={{ fontSize: 16, fontWeight: 500 }}
            >
              ${subTotalPrice}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2, mx: -2 }} />

          <Button
            variant="contained"
            sx={{ fontWeight: 550, width: "100%" }}
            color="inherit"
            onClick={handleToCheckout}
          >
            Checkout (${subTotalPrice})
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CartPage;
