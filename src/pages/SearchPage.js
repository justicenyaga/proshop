import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { loadProducts } from "../store/products";
import FilterComponent from "../components/FilterComponent";

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const searchQuery = searchParams.get("q");

  const productsSlice = useSelector((state) => state.products);
  const { productsList, loading, error } = productsSlice;

  const allCategories =
    productsList.length && productsList.map((product) => product.category);

  const allBrands =
    productsList.length && productsList.map((product) => product.brand);

  let uniqueCategories = [];
  if (allCategories.length) {
    allCategories.forEach((category) => {
      if (!uniqueCategories.find((cat) => cat.name === category.name)) {
        uniqueCategories.push(category);
      }
    });
  }

  let uniqueBrands = [];
  if (allBrands.length) {
    allBrands.forEach((brand) => {
      if (!uniqueBrands.find((br) => br === brand)) {
        uniqueBrands.push(brand);
      }
    });
  }

  useEffect(() => {
    if (searchQuery) {
      dispatch(loadProducts(searchQuery));
    } else {
      navigate("/");
    }
  }, [dispatch, navigate, searchQuery, productsList.length]);

  const ProductNotFound = () => {
    return (
      <Box
        sx={{
          width: "98%",
          height: "50%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          px: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        textAlign={"center"}
      >
        <Typography
          variant="h5"
          fontSize={isDesktop ? 24 : 18}
          component={"div"}
          sx={{ color: "text.secondary" }}
        >
          There are no products found for your search - "{searchQuery}"
        </Typography>

        <Typography
          variant="subtitle1"
          fontSize={isDesktop ? 18 : 15}
          component={"div"}
          sx={{ color: "text.secondary", marginTop: 2 }}
        >
          - Try checking for typos or use more general terms
        </Typography>

        <Button
          variant="contained"
          sx={{ marginTop: 2, fontWeight: "550" }}
          color="inherit"
          onClick={() => navigate("/")}
        >
          Go To Homepage
        </Button>
      </Box>
    );
  };

  return (
    <div>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : error ? (
        <Alert severity="error" variant="outlined">
          {error}
        </Alert>
      ) : productsList.length === 0 ? (
        <ProductNotFound />
      ) : (
        <FilterComponent
          products={productsList}
          categories={uniqueCategories}
          categoryFilterBy="name"
          brands={uniqueBrands}
        />
      )}
    </div>
  );
};

export default SearchPage;
