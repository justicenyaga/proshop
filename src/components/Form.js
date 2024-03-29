import React from "react";
import { toast } from "react-toastify";
import { Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GoogleIcon from "@mui/icons-material/Google";

import FormField from "./FormField";
import Container from "./FormContainer";

import { logoUrl } from "../utils/imageUrls";

const renderFormField = (
  label,
  type,
  setValue,
  onChangeAction,
  placeholder = "",
  required = true,
  validate = false
) => {
  return (
    <FormField
      label={label}
      type={type}
      validate={validate}
      setTargetValue={setValue}
      placeholder={placeholder ? placeholder : `Enter ${label}`}
      required={required}
      onChangeAction={onChangeAction}
    />
  );
};

const renderSubmitButton = (label, loading, icon) => {
  return (
    <LoadingButton
      variant="contained"
      color="inherit"
      type="submit"
      fullWidth
      loading={loading}
      loadingPosition="start"
      sx={{
        borderRadius: 1,
        mt: 2,
        fontWeight: 600,
        textTransform: "initial",
        "&:hover": {
          boxShadow: 3,
          transform: "scale(1.02)",
        },
      }}
      startIcon={icon ? icon : null}
    >
      {label}
    </LoadingButton>
  );
};

const renderGoogleButton = () => {
  const handleContinueWithGoogle = async () => {
    window.location.replace(
      process.env.REACT_APP_API_URL + "/api/users/google/?flag=google"
    );
  };

  return (
    <Button
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={handleContinueWithGoogle}
      fullWidth
      sx={{
        borderRadius: 1,
        fontWeight: 600,
        fontSize: 14,
        textTransform: "initial",
        "&:hover": {
          boxShadow: 3,
          transform: "scale(1.02)",
        },
      }}
    >
      Continue With Google
    </Button>
  );
};

const submitHandler = (e, data, schema, action) => {
  e.preventDefault();

  const { error } = schema.validate(
    { ...data },
    {
      abortEarly: false,
      errors: { label: "key", wrap: { label: false } },
    }
  );
  if (error) return toast.error(error.details[0].message) && null;

  action();
};

const FormContainer = ({ title, subtitle, onSubmit, children }) => {
  return (
    <Container>
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
      <Typography variant="body1" sx={{ mt: 2, fontSize: 18, fontWeight: 580 }}>
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            mt: 0.5,
            fontSize: 14,
            mb: 1,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {subtitle}
        </Typography>
      )}
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {children}
      </form>
    </Container>
  );
};

export {
  submitHandler,
  renderFormField,
  renderSubmitButton,
  renderGoogleButton,
  FormContainer,
};
