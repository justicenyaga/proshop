import React from "react";
import { Link } from "react-router-dom";
import { ListItem, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

const CategoryListItem = ({
  category,
  categoryIcon,
  label,
  activeCategory,
  onMouseEnter,
  onClick,
}) => {
  return (
    <ListItem
      sx={{
        "&:hover": {
          "& .MuiSvgIcon-root": {
            color: grey[400],
          },
          "& .MuiTypography-root": {
            color: grey[400],
          },
        },
        "& .MuiSvgIcon-root": {
          color: activeCategory === category ? grey[400] : "inherit",
        },
        "& .MuiTypography-root": {
          color: activeCategory === category ? grey[400] : "inherit",
        },
      }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <Link
        to={`/category?query=${category}`}
        style={{ textDecoration: "none" }}
      >
        <Stack direction="row" spacing={1}>
          {categoryIcon}
          <Typography variant="body1" sx={{ fontSize: 13, fontWeight: 500 }}>
            {label}
          </Typography>
        </Stack>
      </Link>
    </ListItem>
  );
};

export default CategoryListItem;
