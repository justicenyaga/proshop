import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  TextField,
  Stack,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Profile = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { userInfo } = useSelector((state) => state.user);

  const CustomTextField = ({ label, name, value }) => (
    <TextField
      fullWidth
      label={label}
      margin="normal"
      name={name}
      value={value}
      variant="standard"
      inputProps={{ readOnly: true }}
    />
  );

  const EditButton = () => (
    <Button
      color="inherit"
      variant={isMobile ? "contained" : "text"}
      sx={{
        fontWeight: 550,
        textTransform: "initial",
        mt: isMobile ? 2 : 0,
      }}
      onClick={() => navigate("/profile/account/edit")}
      fullWidth={isMobile}
    >
      Edit Profile
    </Button>
  );

  return (
    <>
      {!isMobile && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18 }}>
            Profile Details
          </Typography>

          <EditButton />
        </Stack>
      )}

      <CustomTextField
        label="First Name"
        name="first_name"
        value={userInfo.first_name}
      />
      <CustomTextField
        label="Last Name"
        name="last_name"
        value={userInfo.last_name}
      />
      <CustomTextField label="Email" name="email" value={userInfo.email} />
      <CustomTextField
        label="Gender"
        name="gender"
        value={userInfo.gender ? userInfo.gender : "N/A"}
      />
      <CustomTextField
        label="Date of Birth"
        name="dob"
        value={userInfo.dob ? new Date(userInfo.dob).toDateString() : "N/A"}
      />

      {isMobile && <EditButton />}
    </>
  );
};

export default Profile;
