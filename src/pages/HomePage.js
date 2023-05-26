import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Box, Button, Alert } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import queryString from "query-string";

import Product from "../components/Product";
import HomePageHeader from "../components/HomePageHeader";
import { ProductSkeleton } from "../components/Skeletons";

import { loadProducts } from "../store/products";
import { authenticateWithGoogle } from "../store/user";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [productsToShow, setProductsToShow] = useState(24);

  const reduxState = useSelector((state) => state);

  const { productsList: products, loading, error } = reduxState.products;
  const { isAuthenticated } = reduxState.user;

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  useEffect(() => {
    const values = queryString.parse(location.search);
    const state = values.state ? values.state : null;
    const code = values.code ? values.code : null;

    if (state && code) {
      if (isAuthenticated) navigate("/");
      else dispatch(authenticateWithGoogle(state, code));
    }
  }, [dispatch, navigate, isAuthenticated, location.search]);

  const handleLoadMoreClick = () => {
    setProductsToShow(productsToShow + 24);
  };

  return (
    <div>
      <HomePageHeader loading={loading} />

      {loading ? (
        <Grid
          container
          spacing={1}
          sx={{
            bgcolor: "white",
            paddingBottom: 1,
            paddingRight: 1,
            borderRadius: "5px",
            boxShadow: 3,
            marginTop: 2,
          }}
        >
          {[...Array(24)].map((_, index) => (
            <Grid key={index} item xs={6} sm={4} md={3} lg={2}>
              <ProductSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Alert severity="error" variant="outlined" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      ) : (
        <div>
          <Grid
            container
            spacing={1}
            sx={{
              bgcolor: "white",
              paddingBottom: 1,
              paddingRight: 1,
              borderRadius: "5px",
              boxShadow: 3,
              marginTop: 2,
            }}
          >
            {products.slice(0, productsToShow).map((product) => (
              <Grid key={product._id} item xs={6} sm={4} md={3} lg={2}>
                <Product product={product} />
              </Grid>
            ))}
          </Grid>

          {productsToShow < products.length && (
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                color="inherit"
                onClick={handleLoadMoreClick}
                variant="contained"
                endIcon={<ExpandMoreIcon />}
              >
                Show More
              </Button>
            </Box>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
