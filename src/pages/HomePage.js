import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Box, Button, Alert } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Product from "../components/Product";
import HomePageHeader from "../components/HomePageHeader";
import { ProductSkeleton } from "../components/Skeletons";

import { loadProducts } from "../store/products";

const HomePage = () => {
  const dispatch = useDispatch();

  const [productsToShow, setProductsToShow] = useState(24);

  const reduxState = useSelector((state) => state);

  const { productsList: products, loading, error } = reduxState.products;

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

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
