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

import { changePassword, clearError } from "../store/user";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [helperText, setHelperText] = useState("");

  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

  const { error, loading, passwordChangeSuccess } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    error && toast.error(error);
    passwordChangeSuccess &&
      toast.success("Password changed successfully.") &&
      dispatch(clearError());
  }, [error, dispatch, passwordChangeSuccess]);

  const validatePassword = (label, value) => {
    if (value === "") setHelperText(`${label} is Required`);
    else if (value.length < 8)
      setHelperText(`${label} must be at least 8 characters long`);
    else if (!lowercaseRegex.test(value))
      setHelperText(`${label} must contain a lowercase letter`);
    else if (!uppercaseRegex.test(value))
      setHelperText(`${label} must contain an uppercase letter`);
    else if (!numberRegex.test(value))
      setHelperText(`${label} must contain a number`);
    else if (!specialCharacterRegex.test(value))
      setHelperText(`${label} must contain a special character`);
    else setHelperText("");
  };

  const handleChange = (newValue, setValue) => {
    dispatch(clearError());
    setValue(newValue);
  };

  const handleValidatePasswordOnChange = (label, value, setValue) => {
    dispatch(clearError());
    setValue(value);
    validatePassword(label, value);
  };

  const toggleShowPassword = (value, setValue) => {
    setValue(!value);
  };

  const renderCustomTextField = (
    label,
    value,
    setValue,
    placeholder,
    showPassword,
    setShowPassword,
    validate
  ) => {
    return (
      <TextField
        fullWidth
        type={showPassword ? "text" : "password"}
        label={label}
        name={label}
        variant="outlined"
        required
        sx={{ mb: 2 }}
        error={validate && helperText ? true : false}
        helperText={validate && helperText && helperText}
        InputProps={{
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
        }}
        value={value}
        onChange={(e) =>
          validate
            ? handleValidatePasswordOnChange(label, e.target.value, setValue)
            : handleChange(e.target.value, setValue)
        }
        placeholder={placeholder ? placeholder : `Enter ${label}...`}
      />
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(clearError());

    if (helperText) return toast.error(helperText);
    if (newPassword !== confirmNewPassword)
      return toast.error("Confirm Password does not match New Password.");

    dispatch(changePassword(newPassword, currentPassword));
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isMobile && (
        <Typography
          variant="body1"
          sx={{ fontWeight: 550, fontSize: 18, mb: 2 }}
        >
          Change Password
        </Typography>
      )}

      {renderCustomTextField(
        "New Password",
        newPassword,
        setNewPassword,
        null,
        showNewPassword,
        setShowNewPassword,
        true
      )}
      {renderCustomTextField(
        "Confirm New Password",
        confirmNewPassword,
        setConfirmNewPassword,
        "Confirm New Password...",
        showConfirmNewPassword,
        setShowConfirmNewPassword
      )}
      {renderCustomTextField(
        "Current Password",
        currentPassword,
        setCurrentPassword,
        null,
        showCurrentPassword,
        setShowCurrentPassword
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

export default ChangePassword;
