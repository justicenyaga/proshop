import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Stack,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Button,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { grey, red } from "@mui/material/colors";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import RateReviewIcon from "@mui/icons-material/RateReview";
import BookIcon from "@mui/icons-material/Book";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MailIcon from "@mui/icons-material/Mail";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Profile from "../components/Profile";
import ProfileEdit from "../components/ProfileEdit";
import Orders from "../components/Orders";
import Order from "../components/Order";
import AddressBook from "../components/AddressBook";
import AddressEdit from "../components/AddressEdit";
import PendingReviews from "../components/PendingReviews";
import ReviewProduct from "../components/ReviewProduct";
import ChangeEmail from "../components/ChangeEmail";
import ChangePassword from "../components/ChangePassword";
import DeleteAccount from "../components/DeleteAccount";

import { logout } from "../store/user";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { tab, section } = useParams();

  const [selectedTitle, setSelectedTitle] = useState(isMobile ? -1 : 0);
  const [selectedSecurityItem, setSelectedSecurityItem] = useState(-1);
  const [openSecurity, setOpenSecurity] = useState(false);

  const { userInfo } = useSelector((state) => state.user);

  const items = [
    {
      label: "My Account",
      icon: <AccountCircleIcon />,
      route: "/profile/account",
    },
    {
      label: "Orders",
      icon: <Inventory2Icon />,
      route: "/profile/orders",
    },
    {
      label: "Pending Reviews",
      icon: <RateReviewIcon />,
      route: "/profile/reviews",
    },
    {
      label: "Address Book",
      icon: <BookIcon />,
      route: "/profile/addresses",
    },
  ];

  useEffect(() => {
    !userInfo?.id && navigate("/login");
    !isMobile && !tab && navigate("/profile/account");

    tab === "account"
      ? setSelectedTitle(0)
      : tab === "orders"
      ? setSelectedTitle(1)
      : tab === "reviews"
      ? setSelectedTitle(2)
      : tab === "addresses"
      ? setSelectedTitle(3)
      : tab === "change-email"
      ? setSelectedSecurityItem(0)
      : tab === "change-password"
      ? setSelectedSecurityItem(1)
      : tab === "delete-account" && setSelectedSecurityItem(2);
  }, [tab, navigate, userInfo]);

  const handleListItemClick = (index, item) => {
    setSelectedTitle(index);
    setSelectedSecurityItem(-1);
    navigate(item.route);
  };

  const handleSecurityItemClick = (index, route) => {
    setSelectedSecurityItem(index);
    setSelectedTitle(-1);
    navigate(route);
  };

  const handleToggleOpenSecurity = () => {
    setOpenSecurity(!openSecurity);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const mobileHeaders = {
    account: "Profile Details",
    orders: "Orders",
    reviews: "Pending Reviews",
    addresses: "Address Book",
    "change-email": "Change Email",
    "change-password": "Change Password",
    "delete-account": "Delete Account",
    sections: {
      account: {
        edit: "Edit Profile",
      },
      addresses: {
        [section === "new" ? "new" : section]:
          section === "new" ? "Add a New Address" : "Edit Address",
      },
      orders: {
        [section]: "Order Details",
      },
      reviews: {
        [section]: "Review Product",
      },
    },
  };

  const tabContent = () => {
    switch (tab) {
      case "account":
        return section ? <ProfileEdit /> : <Profile />;
      case "orders":
        return section ? <Order /> : <Orders />;
      case "addresses":
        return section ? <AddressEdit /> : <AddressBook />;
      case "reviews":
        return section ? <ReviewProduct /> : <PendingReviews />;
      case "change-email":
        return <ChangeEmail />;
      case "change-password":
        return <ChangePassword />;
      case "delete-account":
        return <DeleteAccount />;
      default:
        return null;
    }
  };

  return (
    <>
      {isMobile && tab && (
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {section
              ? mobileHeaders.sections[tab][section]
              : mobileHeaders[tab]}
          </Typography>
        </Stack>
      )}

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        {(!isMobile || (isMobile && !tab)) && (
          <Box
            sx={{
              width: isMobile ? "100%" : "30%",
              height: "fit-content",
              bgcolor: "white",
              borderRadius: "10px",
              boxShadow: 0.5,
            }}
          >
            <List
              sx={{
                py: 0,
                "& .MuiListItemButton-root.Mui-selected": {
                  bgcolor: grey[300],
                },
              }}
            >
              {items.map((item, index) => (
                <ListItemButton
                  key={index}
                  selected={selectedTitle === index}
                  onClick={() => handleListItemClick(index, item)}
                  sx={
                    index === 0
                      ? {
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }
                      : {}
                  }
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}

              <ListItemButton onClick={handleToggleOpenSecurity}>
                <ListItemIcon>
                  <LockIcon />
                </ListItemIcon>
                <ListItemText primary="Security Settings" />
                {openSecurity ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={openSecurity} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    selected={selectedSecurityItem === 0}
                    onClick={() =>
                      handleSecurityItemClick(0, "/profile/change-email")
                    }
                    sx={{
                      pl: 6,
                    }}
                  >
                    <ListItemIcon>
                      <MailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Change Email" />
                  </ListItemButton>

                  <ListItemButton
                    selected={selectedSecurityItem === 1}
                    onClick={() =>
                      handleSecurityItemClick(1, "/profile/change-password")
                    }
                    sx={{
                      pl: 6,
                    }}
                  >
                    <ListItemIcon>
                      <VpnKeyIcon />
                    </ListItemIcon>
                    <ListItemText primary="Change Password" />
                  </ListItemButton>
                  <ListItemButton
                    selected={selectedSecurityItem === 2}
                    onClick={() =>
                      handleSecurityItemClick(2, "/profile/delete-account")
                    }
                    sx={{
                      pl: 6,
                      color: red[500],
                      "&:hover": {
                        bgcolor: red[50],
                      },
                      "& .MuiListItemButton-root.Mui-selected": {
                        bgcolor: red[50],
                      },
                    }}
                  >
                    <ListItemIcon>
                      <DeleteIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Delete Account" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>

            <Divider />

            <ListItem>
              <Button
                variant="contained"
                color="inherit"
                fullWidth
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </ListItem>
          </Box>
        )}

        {(!isMobile || (isMobile && tab)) && (
          <Box
            sx={{
              width: isMobile ? "100%" : "70%",
              height: "fit-content",
              minHeight: !isMobile ? "400px" : "fit-content",
              bgcolor: "white",
              borderRadius: "10px",
              boxShadow: 0.5,
              p: 2,
            }}
          >
            {tabContent()}
          </Box>
        )}
      </Stack>
    </>
  );
};

export default ProfilePage;
