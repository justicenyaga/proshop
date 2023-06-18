import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  CircularProgress,
  Typography,
  IconButton,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";

import { getUserDetails, clearUserDetails } from "../store/userDetails";
import { updateUser } from "../store/userList";

const renderCustomTextField = (label, value, setValue, type = "text") => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={type}
      variant="outlined"
      required
      fullWidth
      size="small"
      sx={{ marginBottom: 1 }}
    />
  );
};

const UserEditPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const reduxState = useSelector((state) => state);

  const { user, loading, error } = reduxState.userDetails;
  const { userInfo } = reduxState.user;

  useEffect(() => {
    !userInfo.is_staff && navigate("/login");

    if (!user.id || user.id !== Number(userId))
      dispatch(getUserDetails(userId));
    else {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
      setIsActive(user.is_active);
      setIsAdmin(user.is_staff);
    }
  }, [dispatch, navigate, user, userId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      isActive,
      isAdmin,
    };

    dispatch(updateUser(updatedUser));
    toast.success("User updated successfully");
    navigate("/admin/users");
    dispatch(clearUserDetails());
  };

  const backButtonHandler = () => {
    navigate(-1);
    dispatch(clearUserDetails());
  };

  return (
    <FormContainer>
      <Box justifyContent="left" width="100%">
        <Stack direction="row" alignItems="center" mb={1} spacing={2}>
          <IconButton sx={{ p: 0 }} onClick={backButtonHandler}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18 }}>
            User Details
          </Typography>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" width="100%">
            <CircularProgress color="inherit" size={150} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack direction="row" spacing={0.5} justifyContent="space-between">
              {renderCustomTextField("First Name", firstName, setFirstName)}
              {renderCustomTextField("Last Name", lastName, setLastName)}
            </Stack>

            {renderCustomTextField("Email", email, setEmail, "email")}

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControlLabel
                label="Is Active"
                control={
                  <Checkbox
                    checked={isActive}
                    color="default"
                    onChange={(e) => setIsActive(e.target.checked)}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                }
              />

              <FormControlLabel
                label="Is Admin"
                control={
                  <Checkbox
                    checked={isAdmin}
                    color="default"
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                }
              />
            </Stack>

            <Button
              type="submit"
              color="inherit"
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ mt: 2 }}
            >
              Update
            </Button>
          </form>
        )}
      </Box>
    </FormContainer>
  );
};

export default UserEditPage;
