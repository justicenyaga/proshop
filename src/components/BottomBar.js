import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Box,
  Button,
  Typography,
  CircularProgress,
  Avatar,
  Divider,
  Menu,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import AdminIcon from "@mui/icons-material/AdminPanelSettings";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UsersIcon from "@mui/icons-material/PeopleAlt";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import OrdersIcon from "@mui/icons-material/LocalShipping";

import NavMenuItem from "./NavMenuItem";

import { logout } from "../store/user";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { toast } from "react-toastify";

import { addItemToCart, removeCartItem } from "../store/cart";

function BottomBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, isAuthenticated } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { product } = useSelector((state) => state.productDetails);

  let totalItemsInCart = 0;
  cartItems.map((item) => (totalItemsInCart += Number(item.quantity)));

  const path = window.location.pathname;

  // TODO: Implement all the necessary features on the bottom bar:
  //  This include: change the highlighted icon to outlined when Active and update
  //  the active icons when the user navigates to a different page

  const onProductPage = path.startsWith("/product/");
  const productId = onProductPage && path.split("/")[2];

  const productExistsInCart = cartItems.find(
    (item) => item.productId === Number(productId)
  );
  const productStock = product.countInStock;
  const [quantityLoading, setQuantityLoading] = useState(false);

  const [value, setValue] = useState(1);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);

  useEffect(() => {
    (path === "/" || path.startsWith("/?q=")) && setValue(0);
    path.startsWith("/cart") && setValue(1);
    path.startsWith("/admin") && setValue(2);
    (path.startsWith("/profile") ||
      path.startsWith("/login") ||
      path.startsWith("/register")) &&
      setValue(3);
    onProductPage && setValue(4);
  }, [path, value, onProductPage]);

  const handleLogout = () => {
    dispatch(logout());
  };

  function handleAdminClick(event) {
    if (adminAnchorEl !== event.currentTarget) {
      setAdminAnchorEl(event.currentTarget);
    }
  }

  const handleProfileClick = (event) => {
    if (profileAnchorEl !== event.currentTarget) {
      setProfileAnchorEl(event.currentTarget);
    }
  };

  const handleAccountClick = (event) => {
    if (accountAnchorEl !== event.currentTarget) {
      setAccountAnchorEl(event.currentTarget);
    }
  };

  function handleCloseAdmin() {
    setAdminAnchorEl(null);
  }

  const handleCloseProfile = () => {
    setProfileAnchorEl(null);
  };

  const handleCloseAccount = () => {
    setAccountAnchorEl(null);
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();

    setQuantityLoading(true);
    setTimeout(() => {
      setQuantityLoading(false);
    }, 600);

    const quantity = 1;
    if (quantity > productStock) {
      toast.info("Product out of stock");
      return;
    }
    dispatch(addItemToCart(product._id, quantity));
    toast.success("Item added to cart");
  };

  const handleIncrement = (event) => {
    event.stopPropagation();

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
    toast.success("Item added to cart");
  };

  const handleDecrement = (event) => {
    event.stopPropagation();

    setQuantityLoading(true);
    setTimeout(() => {
      setQuantityLoading(false);
    }, 800);

    const quantity = productExistsInCart.quantity - 1;
    if (quantity === 0) {
      dispatch(removeCartItem(product._id));
      toast.success("Product removed from cart");
    } else {
      dispatch(addItemToCart(product._id, quantity));
      toast.success("Item quantity updated");
    }
  };

  return (
    <BottomNavigation
      sx={{
        "& .MuiBottomNavigationAction-root.Mui-selected": {
          color: "white",
        },
      }}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
    >
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon fontSize="small" />}
        onClick={() => navigate("/")}
      />
      <BottomNavigationAction
        label="Cart"
        icon={
          <Badge badgeContent={totalItemsInCart} color="error">
            <ShoppingCartIcon fontSize="small" />
          </Badge>
        }
        onClick={() => navigate("/cart")}
      />

      {isAuthenticated && userInfo.is_staff && !onProductPage && (
        <BottomNavigationAction
          label="Admin"
          icon={<AdminIcon fontSize="small" />}
          onClick={handleAdminClick}
        />
      )}

      {!onProductPage &&
        (isAuthenticated && userInfo?.id ? (
          <BottomNavigationAction
            onClick={handleProfileClick}
            icon={
              <Avatar sizes="small">
                {userInfo.first_name[0]}
                {userInfo.last_name[0]}
              </Avatar>
            }
          />
        ) : (
          <BottomNavigationAction
            label="Account"
            icon={<PersonIcon fontSize="small" />}
            onClick={handleAccountClick}
          />
        ))}

      {onProductPage && (
        <Box
          ml={2}
          sx={{
            width: "50%",
            height: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {productExistsInCart ? (
            <Box
              sx={{
                display: "flex",
                width: "70%",
                height: "80%",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="inherit"
                sx={{ flex: "0 0 10%", minWidth: "30px" }}
                onClick={handleDecrement}
                disabled={quantityLoading}
              >
                <RemoveIcon color="white" fontSize="small" />
              </Button>
              <Typography
                variant="body2"
                align="center"
                sx={{ flex: "1 1 80%" }}
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
                    color: "white",
                    opacity: 0.5,
                  },
                }}
                onClick={handleIncrement}
                disabled={
                  quantityLoading ||
                  productExistsInCart.quantity === productStock
                }
              >
                <AddIcon color="white" fontSize="small" />
              </Button>
            </Box>
          ) : quantityLoading ? (
            <Box
              sx={{
                marginTop: 1,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <CircularProgress size={20} color="inherit" />
            </Box>
          ) : (
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              sx={{
                color: "white",
                fontWeight: 550,
                fontSize: 12,
                textTransform: "none",
                width: "80%",
                height: "90%",
                alignSelf: "center",
                borderRadius: 25,
                "&:disabled": {
                  color: "grey",
                  borderColor: "white",
                  opacity: 0.5,
                },
              }}
              onClick={handleAddToCart}
              endIcon={<AddShoppingCartIcon fontSize="small" />}
            >
              Add to Cart
            </Button>
          )}
        </Box>
      )}

      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleCloseProfile}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        getContentAnchorEl={null}
      >
        <NavMenuItem
          label="Profile"
          icon={<PersonIcon fontSize="small" />}
          route="/profile"
          handleClose={handleCloseProfile}
          props={{ dense: true }}
        />
        <Divider sx={{ margin: "0" }} />
        <NavMenuItem
          label="Logout"
          icon={<LogoutIcon fontSize="small" />}
          onClick={handleLogout}
          handleClose={handleCloseProfile}
          props={{ dense: true }}
        />
      </Menu>

      <Menu
        anchorEl={adminAnchorEl}
        open={Boolean(adminAnchorEl)}
        onClose={handleCloseAdmin}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        getContentAnchorEl={null}
      >
        <NavMenuItem
          label="Users"
          icon={<UsersIcon fontSize="small" />}
          route="/admin/users"
          handleClose={handleCloseAdmin}
          props={{ dense: true }}
        />
        <Divider sx={{ margin: "0" }} />
        <NavMenuItem
          label="Products"
          icon={<ShoppingBasketIcon fontSize="small" />}
          route="/admin/products"
          handleClose={handleCloseAdmin}
          props={{ dense: true }}
        />
        <Divider sx={{ margin: "0" }} />
        <NavMenuItem
          label="Orders"
          icon={<OrdersIcon fontSize="small" />}
          route="/admin/orders"
          handleClose={handleCloseAdmin}
          props={{ dense: true }}
        />
      </Menu>

      <Menu
        anchorEl={accountAnchorEl}
        open={Boolean(accountAnchorEl)}
        onClose={handleCloseAccount}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        getContentAnchorEl={null}
      >
        <NavMenuItem
          label="Login"
          icon={<LoginIcon fontSize="small" />}
          route="/login"
          handleClose={handleCloseAccount}
          props={{ dense: true }}
        />
        <Divider sx={{ margin: "0" }} />
        <NavMenuItem
          label="Sign up"
          icon={<PersonAddIcon fontSize="small" />}
          route="/register"
          handleClose={handleCloseAccount}
          props={{ dense: true }}
        />
      </Menu>
    </BottomNavigation>
  );
}

export default BottomBar;
