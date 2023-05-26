import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Grid,
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Alert,
  Card,
  Divider,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MinusIcon from "@mui/icons-material/Remove";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import FilterNumericInput from "./FilterNumericInput";
import Product from "./Product";

const FilterComponent = ({
  products: productsList,
  categories: all_categories,
  categoryFilterBy,
  brands: all_brands,
}) => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [openFilters, setOpenFilters] = useState(false);

  const [prices, setPrices] = useState([0, 0]);
  const [filteredPrices, setFilteredPrices] = useState([0, 0]);
  const [ratings, setRatings] = useState([0, 5]);
  const [filteredRatings, setFilteredRatings] = useState([0, 5]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const min_price =
    productsList.length &&
    Number(
      Math.min(...productsList.map((product) => product.price)).toFixed(2)
    );
  const max_price =
    productsList.length &&
    Number(
      Math.max(...productsList.map((product) => product.price)).toFixed(2)
    );

  const isFilteredByCategory = categories.length;
  const isFilteredByBrand = brands.length;

  const filteredByPriceCondition1 =
    filteredPrices[0] === 0 && filteredPrices[1] === 0;
  const filteredByPriceCondition2 =
    filteredPrices[0] === min_price && filteredPrices[1] === max_price;

  const isFilteredByPrice =
    filteredByPriceCondition1 || filteredByPriceCondition2 ? false : true;

  const isFilteredByRating =
    filteredRatings[0] === 0 && filteredRatings[1] === 5 ? false : true;

  let selectedFilters = [];
  if (isFilteredByCategory) selectedFilters.push("Category");
  if (isFilteredByBrand) selectedFilters.push("Brand");
  if (isFilteredByPrice) selectedFilters.push("Price");
  if (isFilteredByRating) selectedFilters.push("Rating");

  const handleCategoryChange = (event) => {
    const index = categories.indexOf(event.target.value);

    if (index === -1) setCategories([...categories, event.target.value]);
    else
      setCategories(
        categories.filter((category) => category !== event.target.value)
      );
  };

  const handleBrandChange = (event) => {
    const index = brands.indexOf(event.target.value);

    if (index === -1) setBrands([...brands, event.target.value]);
    else setBrands(brands.filter((brand) => brand !== event.target.value));
  };

  const handleSelectAllCategories = () => {
    if (categories.length === all_categories.length) {
      setCategories([]);
    } else {
      setCategories(all_categories.map((category) => category.name));
    }
  };

  const handleSelectAllBrands = () => {
    if (brands.length === all_brands.length) {
      setBrands([]);
    } else {
      setBrands(all_brands);
    }
  };

  const handleFilterByPrice = () => {
    setFilteredPrices(prices);
  };

  const handlePriceChange = (event, newValue) => {
    setPrices(newValue);
  };

  const blurMinPriceConditions = (newValue) => {
    if (newValue < min_price || newValue === "NaN")
      setPrices([min_price, prices[1]]);
    else if (newValue > prices[1]) setPrices([prices[1], prices[1]]);
    else setPrices([newValue, prices[1]]);
  };

  const blurMaxPriceConditions = (newValue) => {
    if (newValue < prices[0] || newValue === "NaN")
      setPrices([prices[0], prices[0]]);
    else if (newValue > max_price) setPrices([prices[0], max_price]);
    else setPrices([prices[0], newValue]);
  };

  const handleFilterByRating = () => {
    setFilteredRatings(ratings);
  };

  const handleRatingChange = (event, newValue) => {
    setRatings(newValue);
  };

  const blurMinRatingConditions = (newValue) => {
    if (newValue < 0 || newValue === "NaN") setRatings([0, ratings[1]]);
    else if (newValue > ratings[1]) setRatings([ratings[1], ratings[1]]);
    else setRatings([newValue, ratings[1]]);
  };

  const blurMaxRatingConditions = (newValue) => {
    if (newValue < ratings[0] || newValue === "NaN")
      setRatings([ratings[0], ratings[0]]);
    else if (newValue > 5) setRatings([ratings[0], 5]);
    else setRatings([ratings[0], newValue]);
  };

  const handleClearFilters = () => {
    setCategories([]);
    setBrands([]);
    setPrices([min_price, max_price]);
    setFilteredPrices([0, 0]);
    setRatings([0, 5]);
    setFilteredRatings([0, 5]);

    openFilters && setOpenFilters(false);
  };

  const handleToggleFilter = () => {
    setOpenFilters(!openFilters);
  };

  useEffect(() => {
    if (productsList.length && prices[0] === 0 && prices[1] === 0) {
      setPrices([min_price, max_price]);
    }

    if (
      !isFilteredByPrice &&
      prices[0] !== min_price &&
      prices[1] !== max_price
    ) {
      setPrices([min_price, max_price]);
    }

    if (productsList.length && ratings[0] === 0 && ratings[1] === 5) {
      setFilteredRatings([0, 5]);
    }

    if (!isFilteredByRating && ratings[0] !== 0 && ratings[1] !== 5) {
      setRatings([0, 5]);
    }

    if (productsList.length) {
      setLoadingProducts(false);
      let filtered_products = productsList;

      if (isFilteredByCategory) {
        filtered_products = filtered_products.filter((product) =>
          categories.includes(product.category[categoryFilterBy])
        );
      }

      if (isFilteredByBrand) {
        filtered_products = filtered_products.filter((product) =>
          brands.includes(product.brand)
        );
      }

      if (isFilteredByPrice) {
        filtered_products = filtered_products.filter(
          (product) =>
            Number(product.price) >= prices[0] &&
            Number(product.price) <= prices[1]
        );
      }

      if (isFilteredByRating) {
        filtered_products = filtered_products.filter(
          (product) =>
            Number(product.rating) >= ratings[0] &&
            Number(product.rating) <= ratings[1]
        );
      }

      setProducts(filtered_products);
    } else {
      setProducts([]);
      handleClearFilters();
      setOpenFilters(false);
    }
  }, [
    dispatch,
    productsList.length,
    isFilteredByCategory,
    isFilteredByBrand,
    isFilteredByPrice,
    filteredPrices[0],
    filteredPrices[1],
    filteredRatings[0],
    filteredRatings[1],
  ]);

  return loadingProducts ? (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
      <CircularProgress color="inherit" />
    </Box>
  ) : (
    <Stack
      direction={isDesktop ? "row" : "column"}
      spacing={1}
      sx={{ marginTop: isDesktop ? 2 : 0 }}
    >
      {!isDesktop && openFilters && (
        <Box
          sx={{ bgcolor: "white", width: "100%" }}
          component={Card}
          elevation={5}
          display="flex"
          alignItems="center"
        >
          <IconButton onClick={handleToggleFilter}>
            <ArrowBackIcon fontSize="large" />
          </IconButton>

          <Typography
            variant="h6"
            fontSize={18}
            component={"h6"}
            color="text.primary"
          >
            Filter
          </Typography>
        </Box>
      )}

      {(isDesktop || openFilters) && (
        <Card
          sx={{
            bgcolor: "white",
            padding: 2,
            borderRadius: "5px",
            minHeight: "50vh",
            height: "fit-content",
            width: isDesktop ? "22%" : "100%",
          }}
          elevation={5}
        >
          {isDesktop && (
            <>
              <Typography
                variant="h6"
                fontSize={18}
                component={"h6"}
                color="text.primary"
              >
                Filter By
              </Typography>

              <Divider sx={{ marginBottom: 2 }} />
            </>
          )}
          {all_categories.length > 0 && (
            <>
              <Typography
                variant="subtitle2"
                fontSize={14}
                component={"h6"}
                color="text.secondary"
              >
                Category
              </Typography>
              <FormControlLabel
                label="Select All"
                control={
                  <Checkbox
                    checked={categories.length === all_categories.length}
                    indeterminate={
                      categories.length > 0 &&
                      categories.length < all_categories.length
                    }
                    onChange={handleSelectAllCategories}
                    size="small"
                    color="default"
                  />
                }
              />
              <List
                sx={{
                  padding: 0,

                  "& .MuiListItem-root": {
                    py: 0,
                    "&:hover": {
                      cursor: "pointer",
                      color: grey[400],
                      "& .MuiCheckbox-root": {
                        color: grey[400],
                      },
                    },
                  },
                }}
              >
                {all_categories &&
                  all_categories.map((category) => (
                    <ListItem key={category.name}>
                      <FormControlLabel
                        label={category.name}
                        control={
                          <Checkbox
                            value={category.name}
                            checked={categories.includes(category.name)}
                            onChange={handleCategoryChange}
                            color="default"
                          />
                        }
                      />
                    </ListItem>
                  ))}
              </List>
              <Divider sx={{ my: 2 }} />
            </>
          )}
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography
              variant="subtitle2"
              component={"h6"}
              color="text.secondary"
              sx={{
                fontSize: 14,
                marginBottom: 1,
              }}
            >
              Price ($)
            </Typography>

            <Button
              size="small"
              variant="outlined"
              color="inherit"
              sx={{ marginBottom: 1 }}
              onClick={handleFilterByPrice}
            >
              Apply
            </Button>
          </Stack>
          <Slider
            value={prices}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={min_price}
            max={max_price}
            sx={{
              marginBottom: 1,
              color: grey[400],
            }}
          />
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ marginBottom: 1, alignItems: "center" }}
          >
            <FilterNumericInput
              label="Min"
              values={prices}
              index={0}
              setValues={setPrices}
              step={0.01}
              min={min_price}
              max={max_price}
              props={{
                size: "small",
                sx: { width: "48%" },
              }}
              blurConditions={blurMinPriceConditions}
            />

            <MinusIcon fontSize="small" />

            <FilterNumericInput
              label="Max"
              values={prices}
              index={1}
              setValues={setPrices}
              step={0.01}
              min={min_price}
              max={max_price}
              props={{
                size: "small",
                sx: { width: "48%" },
              }}
              blurConditions={blurMaxPriceConditions}
            />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography
              variant="subtitle2"
              component={"h6"}
              color="text.secondary"
              sx={{
                fontSize: 14,
                marginBottom: 1,
              }}
            >
              Rating
            </Typography>

            <Button
              size="small"
              variant="outlined"
              color="inherit"
              sx={{ marginBottom: 1 }}
              onClick={handleFilterByRating}
            >
              Apply
            </Button>
          </Stack>
          <Slider
            value={ratings}
            onChange={handleRatingChange}
            valueLabelDisplay="auto"
            min={0}
            max={5}
            step={0.5}
            sx={{
              marginBottom: 1,
              color: grey[400],
            }}
          />
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ marginBottom: 1, alignItems: "center" }}
          >
            <FilterNumericInput
              label="Min"
              values={ratings}
              index={0}
              setValues={setRatings}
              step={0.5}
              min={0}
              max={5}
              props={{
                size: "small",
                sx: { width: "48%" },
              }}
              blurConditions={blurMinRatingConditions}
            />

            <MinusIcon fontSize="small" />

            <FilterNumericInput
              label="Max"
              values={ratings}
              index={1}
              setValues={setRatings}
              step={0.5}
              min={0}
              max={5}
              props={{
                size: "small",
                sx: { width: "48%" },
              }}
              blurConditions={blurMaxRatingConditions}
            />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="subtitle2"
            component={"h6"}
            color="text.secondary"
            sx={{
              fontSize: 14,
            }}
          >
            Brand
          </Typography>
          <FormControlLabel
            label="Select All"
            control={
              <Checkbox
                checked={brands.length === all_brands.length}
                indeterminate={
                  brands.length > 0 && brands.length < all_brands.length
                }
                onChange={handleSelectAllBrands}
                size="small"
                color="default"
              />
            }
          />
          <List
            sx={{
              padding: 0,

              "& .MuiListItem-root": {
                py: 0,
                marginBottom: 1,
                "&:hover": {
                  cursor: "pointer",
                  color: grey[400],
                  "& .MuiCheckbox-root": {
                    color: grey[400],
                  },
                },
              },
            }}
          >
            {all_brands &&
              all_brands.map((brand) => (
                <ListItem key={brand}>
                  <FormControlLabel
                    label={brand}
                    control={
                      <Checkbox
                        value={brand}
                        checked={brands.includes(brand)}
                        onChange={handleBrandChange}
                        color="default"
                      />
                    }
                  />
                </ListItem>
              ))}
          </List>
          {!isDesktop && (
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                fullWidth
                sx={{
                  "&:disabled": {
                    cursor: "not-allowed",
                    pointerEvents: "auto",
                  },
                }}
                onClick={handleClearFilters}
                endIcon={<FilterAltOffIcon />}
                disabled={selectedFilters.length === 0}
              >
                Reset
              </Button>

              <Button
                variant="contained"
                color="inherit"
                size="large"
                fullWidth
                onClick={handleToggleFilter}
              >
                Show ({products.length})
              </Button>
            </Stack>
          )}
        </Card>
      )}

      {!isDesktop && !openFilters && (
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="inherit"
            size="large"
            fullWidth
            onClick={handleToggleFilter}
            endIcon={selectedFilters.length === 0 && <FilterAltIcon />}
          >
            {selectedFilters.length === 0
              ? "Filter"
              : `Filters (${selectedFilters.length})`}
          </Button>

          {selectedFilters.length > 0 && (
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              fullWidth
              onClick={handleClearFilters}
              endIcon={<FilterAltOffIcon />}
            >
              Reset
            </Button>
          )}
        </Stack>
      )}

      {!openFilters && (
        <Stack
          direction="column"
          spacing={2}
          sx={{
            bgcolor: "white",
            padding: 2,
            borderRadius: "5px",
            width: isDesktop ? "78%" : "100%",
            height: isDesktop && "fit-content",
          }}
          component={Card}
          elevation={5}
        >
          {products.length > 0 ? (
            <>
              <Typography
                variant="subtitle2"
                fontSize={14}
                component={"div"}
                color="text.secondary"
              >
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} found
              </Typography>

              <Divider />

              <Grid
                container
                spacing={1}
                sx={{
                  paddingBottom: 1,
                  paddingRight: 1,
                  marginTop: 2,
                }}
              >
                {products.map((product) => (
                  <Grid key={product._id} item xs={6} sm={4} md={3} lg={2}>
                    <Product product={product} />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Alert severity="info">
              No products found for the selected filters
            </Alert>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default FilterComponent;
