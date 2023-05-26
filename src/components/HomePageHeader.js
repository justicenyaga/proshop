import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  List,
  Stack,
  Grid,
  Divider,
  Box,
  ListItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { grey } from "@mui/material/colors";
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
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

import CategoryListItem from "./CategoryListItem";
import CategoryGridItem from "./CategoryGridItem";
import {
  HomePageHeaderCategorySkeleton,
  HomePageHotCategoriesSkeleton,
} from "./Skeletons";

import {
  loadCategories,
  loadSubCategories,
  loadHotCategories,
} from "../store/categories";

const HomePageHeader = ({ loading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(loadCategories());
    dispatch(loadSubCategories());
    dispatch(loadHotCategories());
  }, [dispatch]);

  const [activeCategory, setActiveCategory] = useState(null);

  const {
    categoryList: categories,
    subCategoryList: subCategories,
    hotCategories,
  } = useSelector((state) => state.categories);

  const subCategoriesInActiveCategory = subCategories.filter(
    (sub_cat) => sub_cat.category.slug === activeCategory
  );

  // sort based on clicks
  const sortedHot = [...hotCategories].sort((a, b) => b.clicks - a.clicks);

  // show only 8 hot categories on mobile
  const filteredHot = isMobile ? sortedHot.slice(0, 8) : sortedHot;

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

  const handleCategoryHover = (category) => {
    setActiveCategory(category);
  };

  const handleCategoryMouseLeave = (event) => {
    const isInsideCategory =
      event.relatedTarget &&
      event.relatedTarget.closest &&
      event.relatedTarget.closest(".MuiList-root") !== null;
    const isInsideSubCategory =
      event.relatedTarget &&
      event.relatedTarget.closest &&
      event.relatedTarget.closest(".MuiPaper-root") !== null;
    const isInitialHover =
      !event.target.matches(".MuiListItem-root") &&
      !event.target.matches(".MuiPaper-root");
    if (!isInsideCategory && !isInsideSubCategory && !isInitialHover) {
      setActiveCategory(null);
    }
  };

  const handleCategoryClick = (slug) => {
    navigate(`/${slug}`);
  };

  const handleSubCategoryClick = (main_category, slug) => {
    navigate(`/${main_category}/${slug}`);
  };

  const handleClickHotCategory = (main_category, slug) => {
    navigate(`/${main_category}/${slug}`);
  };

  const handleSubCategoryMouseLeave = (event) => {
    const isInsideSubCategory =
      event.relatedTarget &&
      event.relatedTarget.closest &&
      event.relatedTarget.closest(".MuiPaper-root") !== null;
    const isInsideCategory =
      event.relatedTarget &&
      event.relatedTarget.closest &&
      event.relatedTarget.closest(".MuiList-root") !== null;
    const isInitialHover =
      !event.target.matches(".MuiListItem-root") &&
      !event.target.matches(".MuiPaper-root");
    if (!isInsideSubCategory && !isInsideCategory && !isInitialHover) {
      setActiveCategory(null);
    }
  };

  const CategoriesComponent = () => {
    return loading ? (
      <HomePageHeaderCategorySkeleton />
    ) : (
      <Stack direction="row" width="40%">
        <List
          sx={{
            width: activeCategory ? "50%" : "100%",
            cursor: "pointer",
            "& .MuiListItem-root": {
              paddingTop: 0.5,
              paddingBottom: 0.5,
            },
          }}
          onMouseLeave={handleCategoryMouseLeave}
          component={Paper}
        >
          {categories.map((category) => {
            return (
              <CategoryListItem
                key={category.slug}
                onMouseEnter={() => handleCategoryHover(category.slug)}
                category={category.slug}
                activeCategory={activeCategory}
                label={category.name}
                categoryIcon={categoryIcons[category.slug]}
                onClick={() => handleCategoryClick(category.slug)}
              />
            );
          })}
        </List>

        <Divider orientation="vertical" flexItem />

        {activeCategory && (
          <List
            sx={{
              width: "50%",
              cursor: "pointer",
              "& .MuiListItem-root": {
                py: 0,
              },
            }}
            onMouseLeave={handleSubCategoryMouseLeave}
            component={Paper}
          >
            {subCategoriesInActiveCategory.map((subCategory) => {
              return (
                <ListItem
                  key={subCategory.slug}
                  sx={{
                    "&:hover": {
                      "& .MuiTypography-root": {
                        color: grey[400],
                      },
                    },
                  }}
                  onClick={() =>
                    handleSubCategoryClick(
                      subCategory.category.slug,
                      subCategory.slug
                    )
                  }
                >
                  <Typography variant="body1" sx={{ fontSize: 14 }}>
                    {subCategory.name}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        )}
      </Stack>
    );
  };

  const HotCategoriesComponent = () => {
    return (
      <Box
        sx={{
          width: isDesktop ? "60%" : "100%",
          bgcolor: "white",
          padding: 1,
          borderRadius: "5px",
          boxShadow: 1,
        }}
      >
        {loading ? (
          <HomePageHotCategoriesSkeleton />
        ) : (
          <>
            <Stack direction="row" spacing={1} paddingTop={1}>
              <LocalFireDepartmentIcon sx={{ color: "red" }} fontSize="large" />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 550,
                }}
              >
                Hot Categories
              </Typography>
            </Stack>

            <Grid
              container
              spacing={1}
              height={"80%"}
              sx={{
                borderRadius: "5px",
                marginTop: 1,
                marginLeft: 0.1,
                paddingRight: 0.5,
                "& .MuiGrid-item": {
                  width: "20%",
                  height: "50%",
                  padding: 2,
                  "&:hover": {
                    elevation: 3,
                    boxShadow: 3,
                    transform: "scale(1.02)",
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "1px solid #e0e0e0",
                },
              }}
            >
              {filteredHot.map((item) => (
                <CategoryGridItem
                  onClick={() =>
                    handleClickHotCategory(item.main_category_slug, item.slug)
                  }
                  key={item.slug}
                  image={item.image}
                  label={item.category}
                />
              ))}
            </Grid>
          </>
        )}
      </Box>
    );
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        height: "295px",
      }}
    >
      {isDesktop && <CategoriesComponent />}
      <HotCategoriesComponent />
    </Stack>
  );
};

export default HomePageHeader;
