import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Joi from "joi";
import {
  Divider,
  IconButton,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SignUpIcon from "@mui/icons-material/PersonAddOutlined";
import { toast } from "react-toastify";

import {
  FormContainer,
  submitHandler,
  renderFormField,
  renderSubmitButton,
  renderGoogleButton,
} from "../components/Form";

import { signup, clearError } from "../store/user";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const params = [...searchParams];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRe_password] = useState("");

  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string()
      .min(8)
      .max(30)
      .regex(/^(?=.*[a-z])/)
      .message("Password must contain at least one lowercase letter")
      .regex(/^(?=.*[A-Z])/)
      .message("Password must contain at least one uppercase letter")
      .regex(/^(?=.*\d)/)
      .message("Password must contain at least one number")
      .regex(/^(?=.*[@$!#%*?&])/)
      .message("Password must contain at least one special character")
      .required()
      .label("Password")
      .messages({
        "string.base": "Password should be a string",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password cannot be more than 30 characters",
        "any.required": "Password is required",
      }),
    re_password: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .label("Confirm Password")
      .messages({
        "any.only": "Confirm Password must match Password",
        "any.required": "Confirm Password is required",
      }),
  });

  const userSlice = useSelector((state) => state.user);
  const { isAuthenticated, successSignUp, loading, error } = userSlice;

  const redirect = params.length > 0 ? params[0][1] : "";

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) navigate(`/${redirect}`);
    if (successSignUp) navigate("/not-verified");
    dispatch(clearError());
  }, [isAuthenticated, successSignUp, dispatch, navigate, redirect]);

  const onChangeAction = () => {
    error && dispatch(clearError());
  };

  const submitAction = () => {
    dispatch(clearError());
    dispatch(signup(firstName, lastName, email, password));
  };

  const handleSubmit = (e) => {
    const data = { firstName, lastName, email, password, re_password };
    submitHandler(e, data, schema, submitAction);
  };

  return (
    <>
      {error && toast.error(error) && null}

      {isMobile && (
        <IconButton onClick={() => navigate(-1)} size="large" aria-label="back">
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      )}

      <FormContainer
        title="Welcome to Proshop!"
        subtitle="Enter your details to create your account."
        onSubmit={handleSubmit}
      >
        <Stack direction="row" spacing={0.5} justifyContent="space-between">
          {renderFormField("First Name", "text", setFirstName, onChangeAction)}
          {renderFormField("Last Name", "text", setLastName, onChangeAction)}
        </Stack>

        {renderFormField("Email", "email", setEmail, onChangeAction)}
        {renderFormField(
          "Password", // label
          "password", // type
          setPassword, // setAction
          onChangeAction, // onChangeAction
          "", // placeholder - use default
          true, // required
          true // validate
        )}
        {renderFormField(
          "Confirm Password",
          "password",
          setRe_password,
          onChangeAction,
          "Confirm Password"
        )}
        {renderSubmitButton("Sign up", loading, <SignUpIcon />)}

        <Divider sx={{ my: 1 }}>Or</Divider>

        {renderGoogleButton()}

        <Stack direction="row" mt={2} spacing={1} alignItems="center">
          <Typography variant="body2">Have an account?</Typography>
          <Link to="/login">Sign in</Link>
        </Stack>
      </FormContainer>
    </>
  );
};

export default RegisterPage;
