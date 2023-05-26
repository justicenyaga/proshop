import React from "react";
import { Stack, Typography, LinearProgress } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const ReviewStar = ({ starValue, starReviews, totalReviews }) => {
  const progress_value = (starReviews / totalReviews) * 100;

  return (
    <Stack direction="row" spacing={2} width="100%" alignItems="center">
      <Typography
        variant="body2"
        sx={{
          fontSize: 16,
          width: "20%",
          minWidth: "60px",
        }}
        width="20%"
        alignItems="center"
      >
        {starValue} <StarIcon fontSize="small" sx={{ color: "#ffc107" }} /> (
        {starReviews})
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress_value}
        color="inherit"
        sx={{ width: "80%", height: 10, borderRadius: 6 }}
      />
    </Stack>
  );
};

export default ReviewStar;
