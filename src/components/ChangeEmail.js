import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { changeEmail, clearError } from "../store/user";

const ChangeEmail = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [newEmail, setNewEmail] = useState("");
  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { error, loading, emailChangeSuccess } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    error && toast.error(error);
    emailChangeSuccess &&
      toast.success("Email changed successfully.") &&
      dispatch(clearError());
  }, [error, dispatch, emailChangeSuccess]);

  const handleChange = (newValue, setValue) => {
    dispatch(clearError());
    setValue(newValue);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const renderCustomTextField = (type, label, value, setValue, placeholder) => {
    return (
      <TextField
        fullWidth
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        label={label}
        name={label}
        variant="outlined"
        required
        sx={{ mb: 2 }}
        InputProps={
          type === "password" && {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() =>
                    toggleShowPassword(showPassword, setShowPassword)
                  }
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
          }
        }
        value={value}
        onChange={(e) => handleChange(e.target.value, setValue)}
        placeholder={placeholder ? placeholder : `Enter ${label}...`}
      />
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(clearError());

    if (newEmail !== confirmNewEmail)
      return toast.error("Confirm Email does not match New Email.");

    dispatch(changeEmail(newEmail, currentPassword));
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isMobile && (
        <Typography
          variant="body1"
          sx={{ fontWeight: 550, fontSize: 18, mb: 2 }}
        >
          Change Email
        </Typography>
      )}

      {renderCustomTextField("email", "New Email", newEmail, setNewEmail)}
      {renderCustomTextField(
        "email",
        "Confirm New Email",
        confirmNewEmail,
        setConfirmNewEmail,
        "Confirm New Email..."
      )}
      {renderCustomTextField(
        "password",
        "Current Password",
        currentPassword,
        setCurrentPassword
      )}

      <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
        <LoadingButton
          variant="contained"
          color="inherit"
          size="large"
          loading={loading}
          startIcon={<SaveIcon />}
          type="submit"
          sx={{
            fontSize: 18,
            fontWeight: 550,
            width: isMobile ? "100%" : "40%",
          }}
        >
          Update
        </LoadingButton>
      </div>
    </form>
  );
};

export default ChangeEmail;
