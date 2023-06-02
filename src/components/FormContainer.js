import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";

const FormContainer = ({ children }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        borderRadius: "10px",
        alignItems: "center",
        boxShadow: 3,
        "&:hover": {
          boxShadow: 4,
          transform: "scale(1.01)",
        },
        width: isMobile ? "100%" : isTablet ? "80%" : "40%",
        maxWidth: "488px",
        margin: "0 auto",
        marginTop: isMobile ? "8px" : isTablet ? "16px" : "40px",
        px: isTablet ? 5 : isMobile ? 2 : 8,
        py: 3,
      }}
    >
      {children}
    </Box>
  );
};

export default FormContainer;
