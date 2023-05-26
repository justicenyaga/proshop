import React from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Typography, MenuItem } from "@mui/material";

const NavMenuItem = ({ label, route, onClick, handleClose, icon, props }) => {
  const navigate = useNavigate();

  return (
    <MenuItem
      onClick={() => {
        route && navigate(route);
        onClick && onClick();
        handleClose();
      }}
      {...props}
    >
      <Stack direction="row" spacing={1}>
        {icon}
        <Typography variant="body2">{label}</Typography>
      </Stack>
    </MenuItem>
  );
};

export default NavMenuItem;
