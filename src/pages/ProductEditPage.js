import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  IconButton,
  InputAdornment,
  Typography,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import FormContainer from "../components/FormContainer";
import FormTextField from "../components/FormTextField";

import httpService from "../utils/httpService";

import { getProductDetails } from "../store/productDetails";
import { updateProduct, deleteProduct } from "../store/products";
import { removeCreatedProduct } from "../store/products";
import { loadCategories, loadSubCategories } from "../store/categories";

const ProductEditPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("lg"));

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const [uploadHelperText, setUploadHelperText] = useState(null);

  const reduxState = useSelector((state) => state);

  const { product, loading, error } = reduxState.productDetails;
  const { categoryList: categories, subCategoryList: subCategories } =
    reduxState.categories;
  const { successCreate } = reduxState.products;
  const { userInfo } = reduxState.user;

  const selectedCategorySubCategories =
    subCategories.length &&
    subCategories.filter((sub_cat) => sub_cat.category.name === category);

  useEffect(() => {
    if (!userInfo.is_staff) {
      navigate("/login");
    } else {
      if (successCreate) dispatch(removeCreatedProduct());

      dispatch(loadCategories());
      dispatch(loadSubCategories());

      if (!product.name || product._id !== Number(productId)) {
        dispatch(getProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image_name);
        setBrand(product.brand);
        product.category && setCategory(product.category.name);
        product.category && setSubCategory(product.category.sub_category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [product, dispatch, productId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const cat = subCategories.find(
      (sub_cat) => sub_cat.name === subCategory
    ).slug;

    dispatch(
      updateProduct({
        _id: product._id,
        name,
        price,
        image,
        brand,
        category: cat,
        countInStock,
        description,
      })
    );

    toast.success("Product updated successfully");
    dispatch(getProductDetails(productId));
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("image", file);
    formData.append("product_id", product._id);

    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await httpService.post(
        "/api/products/upload/",
        formData,
        config
      );

      setImage(file.name);
      setUploading(false);

      setUploadHelperText(data);
      setTimeout(() => {
        setUploadHelperText(null);
      }, 6000);
    } catch (error) {
      setUploading(false);
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId));
      navigate("/admin/products");
    }
  };

  return (
    <FormContainer>
      <Box justifyContent="left" width="100%">
        <Stack direction="row" alignItems="center" mb={1} spacing={2}>
          <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18 }}>
            Product Details
          </Typography>
        </Stack>

        {error && toast.error(error)}

        <form onSubmit={handleSubmit}>
          <FormTextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            loading={loading}
          />

          <FormTextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            loading={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />

          <FormTextField
            label="Image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            loading={loading}
            helperText={uploadHelperText && uploadHelperText}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ marginRight: "-10px" }}>
                  <LoadingButton
                    variant="contained"
                    loading={uploading}
                    loadingPosition="start"
                    color="inherit"
                    component="label"
                    startIcon={<FileUploadIcon />}
                    sx={{ fontWeight: 550, marginRight: 0 }}
                  >
                    {isMobile ? "" : "Upload"}

                    <input
                      type="file"
                      hidden
                      onChange={handleUploadFile}
                      accept="image/*"
                    />
                  </LoadingButton>
                </InputAdornment>
              ),
            }}
          />

          <FormTextField
            label="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            loading={loading}
          />

          <FormTextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            loading={loading}
            isSelect
            options={categories.length ? categories : []}
          />

          <FormTextField
            label="Sub Category"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            loading={loading}
            isSelect
            options={
              selectedCategorySubCategories.length
                ? selectedCategorySubCategories
                : []
            }
          />

          <FormTextField
            label="Count In Stock"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            loading={loading}
          />

          <FormTextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            loading={loading}
            isTextArea
          />

          <Stack
            direction="row"
            spacing={3}
            height={50}
            width="100%"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <LoadingButton
              loading={loading}
              variant="contained"
              color="inherit"
              loadingPosition="start"
              size={isMobile ? "small" : isTablet ? "medium" : "large"}
              type="submit"
              startIcon={<SaveIcon />}
            >
              Save
            </LoadingButton>

            <LoadingButton
              loading={loading}
              variant="contained"
              color="error"
              loadingPosition="start"
              size={isMobile ? "small" : isTablet ? "medium" : "large"}
              onClick={() => handleDeleteProduct(product._id)}
              startIcon={<DeleteIcon />}
            >
              Delete
            </LoadingButton>
          </Stack>
        </form>
      </Box>
    </FormContainer>
  );
};

export default ProductEditPage;
