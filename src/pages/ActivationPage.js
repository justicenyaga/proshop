import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { activateAccount } from "../store/user";

import { logoUrl } from "../utils/imageUrls";

const ActivationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { uid, token } = useParams();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const { userInfo, loading } = useSelector((state) => state.user);

  const handleActivateAccount = () => {
    dispatch(activateAccount(uid, token));
  };

  useEffect(() => {
    userInfo?.is_active && !loading && navigate("/");
  }, [navigate, userInfo, loading]);

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "400px",
      }}
      textAlign={"center"}
    >
      <img
        src={logoUrl}
        alt="logo"
        width="100"
        height="100"
        style={{
          borderRadius: "50%",
          borderColor: "green",
          border: "solid 1px",
        }}
      />

      <Typography
        variant="h5"
        fontSize={isDesktop ? 24 : 18}
        component={"div"}
        sx={{ color: "text.secondary", mt: 3, fontWeight: 550 }}
      >
        Finish Signing Up!
      </Typography>

      <Typography
        variant="body1"
        fontSize={isDesktop ? 18 : 14}
        component={"div"}
        sx={{ color: "text.secondary", mt: 1, fontWeight: 500 }}
      >
        Click the verify button below to activate your account.
      </Typography>

      <LoadingButton
        color="inherit"
        variant="contained"
        sx={{ mt: 3, fontWeight: 600 }}
        onClick={handleActivateAccount}
        loading={loading}
        loadingPosition="start"
        startIcon={<HowToRegIcon />}
      >
        Activate
      </LoadingButton>
    </Box>
  );
};

export default ActivationPage;
