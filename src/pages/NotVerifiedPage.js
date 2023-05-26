import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { resendActivationLink } from "../store/user";

import { logoUrl } from "../utils/imageUrls";

const NotVerifiedPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { email: paramsEmail } = useParams();

  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [email, setEmail] = useState("");

  const { userInfo, loading } = useSelector((state) => state.user);

  const handleResendActivationLink = () => {
    dispatch(resendActivationLink(email));
  };

  useEffect(() => {
    !paramsEmail && Object.keys(userInfo).length === 0 && navigate("/login");
    userInfo?.is_active && !loading && navigate("/");
    paramsEmail ? setEmail(paramsEmail) : setEmail(userInfo?.email);
  }, [navigate, userInfo, loading, paramsEmail]);

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
        You are almost there!
      </Typography>

      <Typography
        variant="body1"
        fontSize={isDesktop ? 18 : 14}
        component={"div"}
        sx={{ color: "text.secondary", mt: 1, fontWeight: 500 }}
      >
        We have sent you an activation link to <strong>{email}</strong>.
      </Typography>

      <Typography
        variant="body1"
        fontSize={isDesktop ? 14 : 12}
        component={"div"}
        sx={{ color: "text.secondary", mt: 3, fontWeight: 480 }}
      >
        You will not be able to login or use your account until it is activated.
      </Typography>

      <Button
        color="inherit"
        variant="contained"
        sx={{ mt: 3, fontWeight: 550 }}
        onClick={handleResendActivationLink}
      >
        Resend Activation Link
      </Button>
    </Box>
  );
};

export default NotVerifiedPage;
