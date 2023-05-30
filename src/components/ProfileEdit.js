import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SaveIcon from "@mui/icons-material/Save";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import { updateProfile } from "../store/user";

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const genders = ["Male", "Female", "Other", "Prefer not to say"];

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo?.id) {
      setFirstName(userInfo.first_name);
      setLastName(userInfo.last_name);
      setGender(userInfo.gender ? userInfo.gender : "");
      setDob(userInfo.dob ? dayjs(userInfo.dob) : "");
    }
  }, [userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDob = dob ? dayjs(dob).format("YYYY-MM-DD") : null;

    if (!formattedDob) {
      toast.error("Date of birth is required");
      return;
    } else if (dayjs().diff(formattedDob, "year") < 12) {
      toast.error("You must be at least 12 years old");
      return;
    }

    dispatch(updateProfile(firstName, lastName, gender, formattedDob));
    toast.success("Profile updated successfully");
  };

  return (
    <>
      {!isMobile && (
        <Typography
          variant="body1"
          sx={{ fontWeight: 550, fontSize: 18, mb: 2 }}
        >
          Edit Profile
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="First Name"
          name="first_name"
          variant="outlined"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Last Name"
          sx={{ my: 2 }}
          name="last_name"
          variant="outlined"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          fullWidth
          select
          label="Gender"
          name="gender"
          variant="outlined"
          required
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          {genders.map((gender) => (
            <MenuItem key={gender} value={gender}>
              {gender}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="Date of Birth"
          value={dob}
          format="DD-MM-YYYY"
          onChange={(newValue) => {
            setDob(newValue);
          }}
          sx={{ my: 2 }}
        />

        <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
          <Button
            variant="contained"
            color="inherit"
            size="large"
            startIcon={<SaveIcon />}
            type="submit"
            sx={{
              fontSize: 18,
              fontWeight: 550,
              width: isMobile ? "100%" : "40%",
            }}
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileEdit;
