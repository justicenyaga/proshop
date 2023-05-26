import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SpaIcon from "@mui/icons-material/SpaOutlined";
import CoffeeMakerIcon from "@mui/icons-material/CoffeeMakerOutlined";
import MicrowaveIcon from "@mui/icons-material/MicrowaveOutlined";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import DevicesIcon from "@mui/icons-material/Devices";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import SportsEsportsIcon from "@mui/icons-material/SportsEsportsOutlined";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import CategoryListItem from "./CategoryListItem";

import { loadCategories } from "../store/categories";

// Temporary solution - (Static data)
const categoryIcons = {
  "health-beauty": <SpaIcon fontSize="small" />,
  "home-office": <CoffeeMakerIcon fontSize="small" />,
  appliances: <MicrowaveIcon fontSize="small" />,
  "phones-tablets": <SmartphoneIcon fontSize="small" />,
  computing: <DevicesIcon fontSize="small" />,
  "tvs-audios": <LiveTvIcon fontSize="small" />,
  fashion: <CheckroomIcon fontSize="small" />,
  "baby-products": <ChildCareIcon fontSize="small" />,
  gaming: <SportsEsportsIcon fontSize="small" />,
  sporting: <FitnessCenterIcon fontSize="small" />,
};

const CategoryDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);

  const { categoryList: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  const handleCategoryClick = (slug) => {
    navigate(`/${slug}`);
    setOpenDrawer(false);
  };

  return (
    <>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon fontSize="large" sx={{ color: "white" }} />
      </IconButton>

      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{
          width: "180px",
        }}
      >
        <Stack
          direction="row"
          spacing={0.2}
          sx={{ alignItems: "center", display: "flex" }}
        >
          <IconButton onClick={() => setOpenDrawer(false)}>
            <CloseIcon />
          </IconButton>

          <Button
            onClick={() => {
              setOpenDrawer(false);
              navigate(`/`);
            }}
            sx={{
              justifyContent: "flex-start",
              color: "black",
              fontSize: 20,
            }}
          >
            PROSHOP
          </Button>
        </Stack>

        <List
          sx={{
            width: "100%",
            cursor: "pointer",
          }}
        >
          <Divider sx={{ marginTop: 0.5, marginBottom: 0.5 }} />

          <Typography
            variant="subtitle2"
            sx={{
              textAlign: "center",
              paddingTop: 1,
              fontWeight: 550,
              fontSize: 12,
              color: "black",
            }}
            component="h6"
          >
            Categories
          </Typography>

          <Divider sx={{ marginTop: 0.5, marginBottom: 0.5 }} />

          {categories.map((category) => {
            return (
              <CategoryListItem
                key={category.slug}
                category={category.slug}
                label={category.name}
                categoryIcon={categoryIcons[category.slug]}
                onClick={() => handleCategoryClick(category.slug)}
              />
            );
          })}
        </List>
      </Drawer>
    </>
  );
};
export default CategoryDrawer;
