import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
import { toast } from "react-toastify";

import {
  submitHandler,
  FormContainer,
  renderFormField,
  renderSubmitButton,
} from "../components/Form";

import { clearError, requestPasswordReset } from "../store/user";

const RequestPasswordReset = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
  });

  const {
    error,
    loading,
    isAuthenticated,
    successPasswordResetRequest: successRequest,
  } = useSelector((state) => state.user);

  const onChangeAction = () => {
    error && dispatch(clearError());
  };

  const onSubmitAction = () => {
    dispatch(clearError());
    dispatch(requestPasswordReset(email));
  };

  const handleSubmit = (e) => {
    submitHandler(e, { email }, schema, onSubmitAction);
  };

  useEffect(() => {
    isAuthenticated && navigate("/");
    dispatch(clearError());
  }, [dispatch, error, successRequest, isAuthenticated, navigate]);

  return (
    <>
      {error ? toast.error(error) : null}
      {successRequest ? toast.success("Password reset email sent") : null}

      <FormContainer
        title="Forgot Password"
        subtitle="Enter your email address to request a password reset"
        onSubmit={handleSubmit}
      >
        {renderFormField("Email", "email", setEmail, onChangeAction)}
        {renderSubmitButton("Request Password Reset", loading, null)}
      </FormContainer>
    </>
  );
};

export default RequestPasswordReset;
