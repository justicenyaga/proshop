import React from "react";
import { TextField, MenuItem, Skeleton } from "@mui/material";

const FormTextField = ({
  label,
  value,
  onChange,
  options,
  isSelect = false,
  isTextArea = false,
  InputProps,
  helperText,
  loading,
}) => {
  return isSelect ? (
    loading ? (
      <Skeleton
        variant="rectangular"
        height={40}
        width="100%"
        animation="wave"
        sx={{ my: 1 }}
      />
    ) : (
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        size="small"
        select
        fullWidth
        sx={{ my: 1 }}
        InputProps={InputProps}
        helperText={helperText}
      >
        {options.map((option) => (
          <MenuItem key={option._id} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>
    )
  ) : loading ? (
    <Skeleton
      variant="rectangular"
      height={isTextArea ? 100 : 40}
      width="100%"
      animation="wave"
      sx={{ my: 1 }}
    />
  ) : (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      multiline={isTextArea}
      rows={isTextArea ? 4 : 1}
      size="small"
      fullWidth
      sx={{
        my: 1,
      }}
      InputProps={InputProps}
      helperText={helperText}
    />
  );
};

export default FormTextField;
