import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Button,
  Container,
  Badge,
  Menu,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AdminIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/PeopleAlt";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import OrdersIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

import CategoryDrawer from "./CategoryDrawer";
import SearchBox from "./SearchBox";
import NavMenuItem from "./NavMenuItem";

import { checkAuthentication, loadUser, logout } from "../store/user";

import { logoUrl } from "../utils/imageUrls";

const useStyles = makeStyles({
  logo: {
    height: "30px",
    width: "30px",
    borderRadius: "50%",
  },

  popOverRoot: {
    pointerEvents: "none",
  },
});

function Navbar() {
  const dispatch = useDispatch();

  let currentlyHovering = false;
  const styles = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const { userInfo, isAuthenticated } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  let totalItemsInCart = 0;
  cartItems.map((item) => (totalItemsInCart += Number(item.quantity)));

  const handleLogout = () => {
    dispatch(logout());
  };

  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(checkAuthentication());
    isAuthenticated && dispatch(loadUser());
  }, [dispatch, isAuthenticated]);

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

  function handleAdminHover() {
    currentlyHovering = true;
  }

  const handleProfileHover = () => {
    currentlyHovering = true;
  };

  const handleAccountHover = () => {
    currentlyHovering = true;
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

  function handleCloseAdminHover() {
    currentlyHovering = false;
    setTimeout(() => {
      if (!currentlyHovering) {
        handleCloseAdmin();
      }
    }, 50);
  }

  const handleCloseProfileHover = () => {
    currentlyHovering = false;
    setTimeout(() => {
      if (!currentlyHovering) {
        handleCloseProfile();
      }
    }, 50);
  };

  const handleCloseAccountHover = () => {
    currentlyHovering = false;
    setTimeout(() => {
      if (!currentlyHovering) {
        handleCloseAccount();
      }
    }, 50);
  };

  return (
    <AppBar position={isMobile ? "fixed" : "static"}>
      <Toolbar sx={{ px: 0 }}>
        <Container>
          <Stack direction="row">
            <Stack
              direction="row"
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              width={isMobile ? "100%" : "auto"}
            >
              <Stack direction="row" marginRight={1}>
                {!isDesktop && <CategoryDrawer />}

                {isMobile ? (
                  <IconButton component={Link} to="/">
                    <img src={logoUrl} alt="logo" className={styles.logo} />
                  </IconButton>
                ) : (
                  <Button
                    component={Link}
                    to="/"
                    sx={{ fontSize: 20 }}
                    startIcon={
                      <img src={logoUrl} alt="logo" className={styles.logo} />
                    }
                  >
                    PROSHOP
                  </Button>
                )}
              </Stack>

              <SearchBox />
            </Stack>

            {!isMobile && (
              <>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    flexGrow: 1,
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    component={Link}
                    to="/cart"
                    startIcon={
                      <Badge badgeContent={totalItemsInCart} color="error">
                        <ShoppingCartIcon />
                      </Badge>
                    }
                  >
                    CART
                  </Button>

                  {userInfo && userInfo.is_staff && (
                    <Button
                      aria-owns={adminAnchorEl ? "admin-menu" : undefined}
                      aria-haspopup="true"
                      onClick={handleAdminClick}
                      onMouseEnter={handleAdminClick}
                      onMouseLeave={handleCloseAdminHover}
                      startIcon={<AdminIcon />}
                    >
                      ADMIN
                    </Button>
                  )}

                  {userInfo?.is_active ? (
                    <IconButton
                      aria-owns={profileAnchorEl ? "profile-menu" : undefined}
                      aria-haspopup="true"
                      onClick={handleProfileClick}
                      onMouseEnter={handleProfileClick}
                      onMouseLeave={handleCloseProfileHover}
                    >
                      <Avatar sizes="small">
                        {userInfo.first_name[0]}
                        {userInfo.last_name[0]}
                      </Avatar>
                    </IconButton>
                  ) : (
                    <Button
                      aria-owns={accountAnchorEl ? "account-menu" : undefined}
                      aria-haspopup="true"
                      onClick={handleAccountClick}
                      onMouseEnter={handleAccountClick}
                      onMouseLeave={handleCloseAccountHover}
                      startIcon={<PersonIcon />}
                    >
                      ACCOUNT
                    </Button>
                  )}
                </Stack>

                <Menu
                  id="admin-menu"
                  anchorEl={adminAnchorEl}
                  open={Boolean(adminAnchorEl)}
                  onClose={handleCloseAdmin}
                  MenuListProps={{
                    onMouseEnter: handleAdminHover,
                    onMouseLeave: handleCloseAdminHover,
                    style: { pointerEvents: "auto" },
                  }}
                  getContentAnchorEl={null}
                  anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                  PopoverClasses={{
                    root: styles.popOverRoot,
                  }}
                >
                  <NavMenuItem
                    label="Users"
                    icon={<PeopleIcon fontSize="small" />}
                    route="/admin/users"
                    handleClose={handleCloseAdmin}
                  />
                  <NavMenuItem
                    label="Products"
                    icon={<ShoppingBasketIcon fontSize="small" />}
                    route="/admin/products"
                    handleClose={handleCloseAdmin}
                  />
                  <NavMenuItem
                    label="Orders"
                    icon={<OrdersIcon fontSize="small" />}
                    route="/admin/orders"
                    handleClose={handleCloseAdmin}
                  />
                </Menu>

                <Menu
                  id="account-menu"
                  anchorEl={accountAnchorEl}
                  open={Boolean(accountAnchorEl)}
                  onClose={handleCloseAccount}
                  MenuListProps={{
                    onMouseEnter: handleAccountHover,
                    onMouseLeave: handleCloseAccountHover,
                    style: { pointerEvents: "auto" },
                  }}
                  getContentAnchorEl={null}
                  anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                  PopoverClasses={{
                    root: styles.popOverRoot,
                  }}
                >
                  <NavMenuItem
                    label="Login"
                    icon={<LoginIcon fontSize="small" />}
                    route="/login"
                    handleClose={handleCloseAccount}
                  />
                  <NavMenuItem
                    label="Sign Up"
                    icon={<PersonAddIcon fontSize="small" />}
                    route="/register"
                    handleClose={handleCloseAccount}
                  />
                </Menu>

                <Menu
                  id="profile-menu"
                  anchorEl={profileAnchorEl}
                  open={Boolean(profileAnchorEl)}
                  onClose={handleCloseProfile}
                  MenuListProps={{
                    onMouseEnter: handleProfileHover,
                    onMouseLeave: handleCloseProfileHover,
                    style: { pointerEvents: "auto" },
                  }}
                  getContentAnchorEl={null}
                  anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                  PopoverClasses={{
                    root: styles.popOverRoot,
                  }}
                >
                  <NavMenuItem
                    label="Profile"
                    icon={<PersonIcon fontSize="small" />}
                    route="/profile"
                    handleClose={handleCloseProfile}
                  />
                  <NavMenuItem
                    label="Logout"
                    icon={<LogoutIcon fontSize="small" />}
                    onClick={handleLogout}
                    handleClose={handleCloseProfile}
                  />
                </Menu>
              </>
            )}
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
