import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Joi from "joi";
import LockResetIcon from "@mui/icons-material/LockReset";

import {
  submitHandler,
  FormContainer,
  renderFormField,
  renderSubmitButton,
} from "../components/Form";

import { clearError, resetPassword } from "../store/user";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { uid, token } = useParams();

  const [new_password, setNewPassword] = useState("");
  const [re_new_password, setReNewPassword] = useState("");

  const schema = Joi.object({
    new_password: Joi.string()
      .min(8)
      .max(30)
      .regex(/^(?=.*[a-z])/)
      .message("New password must contain at least one lowercase letter")
      .regex(/^(?=.*[A-Z])/)
      .message("New password must contain at least one uppercase letter")
      .regex(/^(?=.*\d)/)
      .message("New password must contain at least one number")
      .regex(/^(?=.*[@$!#%*?&])/)
      .message("New password must contain at least one special character")
      .required()
      .label("New password")
      .messages({
        "string.base": "New password should be a string",
        "string.min": "New password must be at least 8 characters long",
        "string.max": "New password cannot be more than 30 characters",
        "any.required": "New password is required",
      }),
    re_new_password: Joi.string()
      .valid(Joi.ref("new_password"))
      .required()
      .label("Confirm Password")
      .messages({
        "any.only": "Confirm Password must match New password",
        "any.required": "Confirm Password is required",
      }),
  });

  const {
    error,
    loading,
    isAuthenticated,
    successPasswordReset: successReset,
  } = useSelector((state) => state.user);

  const onChangeAction = () => {
    error && dispatch(clearError());
  };

  const onSubmitAction = () => {
    dispatch(clearError());
    dispatch(resetPassword(uid, token, new_password));
  };

  const handleSubmit = (e) => {
    const data = { new_password, re_new_password };
    submitHandler(e, data, schema, onSubmitAction);
  };

  useEffect(() => {
    isAuthenticated && navigate("/");
    dispatch(clearError());
    successReset && navigate("/login");
  }, [dispatch, error, successReset, navigate, isAuthenticated]);

  return (
    <>
      {error ? toast.error(error) : null}
      {successReset ? toast.success("Password reset successful") : null}

      <FormContainer
        title="Reset Password"
        subtitle="Enter your new password"
        onSubmit={handleSubmit}
      >
        {renderFormField(
          "New Password",
          "password",
          setNewPassword,
          onChangeAction,
          "",
          true,
          true
        )}
        {renderFormField(
          "Confirm New Password",
          "password",
          setReNewPassword,
          onChangeAction,
          "Confirm New Password"
        )}
        {renderSubmitButton("Reset Password", loading, <LockResetIcon />)}
      </FormContainer>
    </>
  );
};

export default ResetPassword;
