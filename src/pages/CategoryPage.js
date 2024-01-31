import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Breadcrumbs,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import FilterComponent from "../components/FilterComponent";
import CategoryGridItem from "../components/CategoryGridItem";

import { loadProducts } from "../store/products";
import { loadCategories, loadSubCategories } from "../store/categories";

const CustomLink = styled(Link)({
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    textDecoration: "underline",
  },
});

const CategoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { category } = useParams();
  const { subcategory } = useParams();

  const [products, setProducts] = useState([]);

  const reduxState = useSelector((state) => state);
  const { productsList, loading, error } = reduxState.products;
  const { categoryList: categories, subCategoryList: subcategories } =
    reduxState.categories;

  let category_subs = [];
  if (!subcategory && categories.length) {
    category_subs = subcategories.filter(
      (subcat) => subcat.category.slug === category
    );
  }

  const allBrands = products.map((product) => product.brand);
  let unique_brands = [];
  allBrands.forEach((brand) => {
    if (!unique_brands.includes(brand)) {
      unique_brands.push(brand);
    }
  });

  let categoryName, sub_categoryName;

  if (categories.length && categories.find((cat) => cat.slug === category)) {
    categoryName = categories.find((cat) => cat.slug === category).name;
  }

  if (
    subcategory &&
    subcategories.length &&
    subcategories.find((subcat) => subcat.slug === subcategory)
  ) {
    sub_categoryName = subcategories.find(
      (subcat) => subcat.slug === subcategory
    ).name;
  }

  useEffect(() => {
    dispatch(loadProducts());
    !subcategory && dispatch(loadSubCategories());
    !categories.length && dispatch(loadCategories());
    !categories.find((cat) => cat.slug === category) && navigate("/page404");
    subcategory &&
      subcategories.length &&
      !subcategories.find((subcat) => subcat.slug === subcategory) &&
      navigate("/page404");

    if (subcategory && productsList.length) {
      setProducts(
        productsList.filter((product) => product.category?.slug === subcategory)
      );
    } else if (!subcategory && productsList.length) {
      setProducts(
        productsList.filter((product) => product.category?.cat_slug === category)
      );
    }
  }, [dispatch, category, subcategory, navigate, productsList.length]);

  const handleClickHotCategory = (slug) => {
    navigate(`/${category}/${slug}`);
  };

  return loading ? (
    <CircularProgress
      color="inherit"
      sx={{
        position: "absolute",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  ) : error ? (
    <Alert severity="error" variant="outlined">
      {error}
    </Alert>
  ) : (
    <>
      {!isMobile && (
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
          separator={<NavigateNextIcon fontSize="small" />}
        >
          <CustomLink to="/">Home</CustomLink>
          {subcategory ? (
            <CustomLink to={`/${category}`}>{categoryName}</CustomLink>
          ) : (
            <Typography color="text.primary">{categoryName}</Typography>
          )}
          {subcategory && (
            <Typography color="text.primary">{sub_categoryName}</Typography>
          )}
        </Breadcrumbs>
      )}
      {!subcategory && (
        <Box
          sx={{
            bgcolor: "white",
            padding: 1,
            borderRadius: "5px",
            visibility: "visible",
            boxShadow: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: grey[800],
              mt: -1,
              mx: -1,
              height: 40,
              borderRadius: "5px 5px 0 0",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 550,
                color: "white",
                fontSize: isMobile ? 15 : 20,
              }}
            >
              {`${categoryName} | `} Shop by Category
            </Typography>
          </Box>

          <Grid
            container
            spacing={1}
            sx={{
              borderRadius: "5px",
              marginTop: 1,
              marginLeft: 0.1,
              paddingRight: 1,
              "& .MuiGrid-item": {
                width: "25%",
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
            {category_subs.map((item) => (
              <CategoryGridItem
                onClick={() => handleClickHotCategory(item.slug)}
                key={item.slug}
                image={item.image}
                label={item.name}
              />
            ))}
          </Grid>
        </Box>
      )}

      <Box mt={1}>
        <FilterComponent
          products={products}
          categories={!subcategory ? category_subs : []}
          categoryFilterBy={!subcategory ? "sub_category" : null}
          brands={unique_brands}
        />
      </Box>
    </>
  );
};

export default CategoryPage;
