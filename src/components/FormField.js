import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
// import Joi from "joi";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const FormField = ({
  label,
  type,
  setTargetValue,
  validate,
  onChangeAction,
  ...rest
}) => {
  const [newValue, setNewValue] = useState("");
  const [helperText, setHelperText] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    onChangeAction && onChangeAction();

    setNewValue(value);
    setTargetValue(value);

    if (value === "") setHelperText(`${label} is Required`);
    else setHelperText("");
  };

  const validatePassword = (value) => {
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

  const handleValidatePasswordOnChange = (e) => {
    const value = e.target.value;

    onChangeAction && onChangeAction();

    setNewValue(value);
    setTargetValue(value);

    validatePassword(value);
  };

  const handleBlur = () => {
    if (type === "email") {
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!newValue) setHelperText(`${label} is Required`);
      else if (newValue && !regex.test(newValue.toLowerCase()))
        setHelperText("Invalid email address");
      else setHelperText("");
    } else if (type === "text") {
      if (!newValue) setHelperText(`${label} is Required`);
      else setHelperText("");
    } else if (type === "password") {
      validate && validatePassword(newValue);
    }
  };

  return (
    <TextField
      id={label}
      label={label}
      type={type === "password" ? (showPassword ? "text" : "password") : type}
      value={newValue}
      onChange={
        type === "password" && validate
          ? handleValidatePasswordOnChange
          : handleChange
      }
      onBlur={handleBlur}
      error={helperText ? true : false}
      helperText={helperText && helperText}
      InputProps={
        type === "password"
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowPassword}
                    variant="text"
                    color="inherit"
                    size="small"
                    sx={{
                      transform: "translateX(10px)",
                    }}
                    disableRipple
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : {}
      }
      fullWidth
      size="small"
      variant="outlined"
      sx={{ marginBottom: 1 }}
      {...rest}
    />
  );
};

export default FormField;
