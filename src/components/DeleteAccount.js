import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  useTheme,
  InputAdornment,
  IconButton,
  useMediaQuery,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { deleteAccount, clearError } from "../store/user";

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { userInfo, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    dispatch(clearError());
    setPassword(e.target.value);
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    dispatch(clearError());
    dispatch(deleteAccount(password));
  };

  return (
    <form onSubmit={handelSubmit}>
      {!isMobile && (
        <Typography
          variant="body1"
          sx={{ fontWeight: 550, fontSize: 18, mb: 2 }}
        >
          Delete Account
        </Typography>
      )}

      <Typography
        variant="body2"
        textAlign="center"
        sx={{ mb: 2, fontSize: 16 }}
      >
        Are you sure you want to delete your account? Please note that this
        action will permanently delete all your data associated with Proshop,
        including your orders, reviews, and profile information and cannot be
        undone.
      </Typography>

      <TextField
        fullWidth
        InputProps={{ readOnly: true }}
        value={userInfo?.email}
        variant="filled"
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        type={showPassword ? "text" : "password"}
        label="Password"
        variant="outlined"
        value={password}
        sx={{ mb: 2 }}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => toggleShowPassword()}
                variant="text"
                color="inherit"
                size="small"
                sx={{
                  transform: "translateX(10px)",
                }}
                disableRipple
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
        <LoadingButton
          variant="contained"
          color="inherit"
          size="large"
          loading={loading}
          type="submit"
          sx={{
            fontSize: 18,
            fontWeight: 550,
            textTransform: "initial",
            width: isMobile ? "100%" : "40%",
          }}
        >
          Close my account
        </LoadingButton>
      </div>
    </form>
  );
};

export default DeleteAccount;
