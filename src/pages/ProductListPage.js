import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, IconButton, Button, Tooltip, Stack } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";

import Table from "../components/Table";
import Dialog from "../components/Dialog";

import {
  loadProducts,
  createProduct,
  deleteProduct,
  deleteMultipleProducts,
  resetSuccessDelete,
} from "../store/products";

const headCells = [
  { id: "_id", type: "number", label: "ID" },
  { id: "name", type: "string", label: "Name" },
  { id: "price", type: "decimal", label: "Price" },
  { id: "category", sec_property: "name", type: "string", label: "Category" },
  {
    id: "category",
    sec_property: "sub_category",
    type: "string",
    label: "Sub Category",
  },
  { id: "brand", type: "bool", label: "Brand" },
  { id: "" },
];

const bodyCells = [
  { key: "_id" },
  { key: "name" },
  { key: "price" },
  { key: "category", sec_property: "name" },
  { key: "category", sec_property: "sub_category" },
  { key: "brand" },
];

const getActionButtons = (products, viewHandler, deleteHandler) => {
  let actionButtons = [];

  products.forEach((product) => {
    actionButtons.push({
      id: product._id,
      buttons: (
        <Stack direction="row">
          <Tooltip enterDelay={500} title="Details">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                viewHandler(product._id);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip enterDelay={500} title="Delete">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                deleteHandler(product._id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    });
  });

  return actionButtons;
};

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);
  const [deleteProductOpen, setDeleteProductOpen] = useState(false);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState(false);
  const [product, setProduct] = useState({});

  const reduxState = useSelector((state) => state);
  const {
    productsList: products,
    loading,
    error,
    successCreate,
    successDelete,
  } = reduxState.products;
  const { userInfo } = reduxState.user;

  const selectedProducts = products.filter((product) =>
    selected.includes(product._id)
  );

  useEffect(() => {
    if (successCreate) {
      const createdProduct = reduxState.products.createdProduct;
      navigate(`/admin/products/${createdProduct._id}`);
    }

    !userInfo.is_staff && navigate("/login");

    if (successDelete) {
      dispatch(loadProducts("refresh-products"));
      dispatch(resetSuccessDelete());
    } else dispatch(loadProducts());
  }, [
    dispatch,
    navigate,
    userInfo,
    products.length,
    successCreate,
    successDelete,
  ]);

  const handleDeleteProduct = () => {
    dispatch(deleteProduct(product._id));
    toast.success("Product deleted successfully");
    setDeleteProductOpen(false);
    setProduct({});
  };

  const handleCreateProduct = () => {
    dispatch(createProduct());
  };

  const handleDeleteSelectedProducts = () => {
    dispatch(deleteMultipleProducts(selected));
    setDeleteMultipleOpen(false);
    toast.success("Products deleted successfully");
    setSelected([]);
  };

  const handleOpenDeleteProduct = (productId) => {
    const product_to_delete = products.find(
      (product) => product._id === productId
    );
    setProduct(product_to_delete);
    setDeleteProductOpen(true);
  };

  const handleViewProduct = (productId) => {
    navigate(`/admin/products/${productId}`);
  };

  const CreateProductButton = () => (
    <Tooltip enterDelay={500} title="Create Product">
      <IconButton onClick={handleCreateProduct} disabled={loading}>
        <AddCircleIcon fontSize="small" color="success" />
      </IconButton>
    </Tooltip>
  );

  const DeleteProductsButton = () => (
    <Tooltip title="Delete products">
      <IconButton
        onClick={() => setDeleteMultipleOpen(true)}
        disabled={loading}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );

  return error ? (
    <Alert severity="error">{error}</Alert>
  ) : (
    <>
      <Table
        tableTitle="Products"
        data={products}
        pk="_id"
        headCells={headCells}
        bodyCells={bodyCells}
        loading={loading}
        selected={selected}
        setSelected={setSelected}
        toolBarMainActions={[CreateProductButton]}
        toolBarSelectedActions={[DeleteProductsButton]}
        rowActionButtons={getActionButtons(
          products,
          handleViewProduct,
          handleOpenDeleteProduct
        )}
      />

      <Dialog
        open={deleteMultipleOpen}
        onCloseHandler={() => setDeleteMultipleOpen(false)}
        title="Delete Users"
        description={
          <div>
            Are you sure you want to want to delete the following{" "}
            {selectedProducts.length === 1 ? "product" : "products"}?
            <ul>
              {selectedProducts.map((product) => (
                <li key={product._id}>{`(${product._id}) ${product.name}`}</li>
              ))}
            </ul>
          </div>
        }
        confirmButton={
          <Button
            autoFocus
            color="error"
            variant="outlined"
            onClick={handleDeleteSelectedProducts}
          >
            Delete
          </Button>
        }
      />

      <Dialog
        open={deleteProductOpen}
        onCloseHandler={() => setDeleteProductOpen(false)}
        title="Delete Product"
        description={
          <div>
            Are you sure you want to want to delete product:{" "}
            {` (${product._id}) - ${product.name}`} ?
          </div>
        }
        confirmButton={
          <Button
            autoFocus
            color="error"
            variant="outlined"
            onClick={handleDeleteProduct}
          >
            Delete
          </Button>
        }
      />
    </>
  );
};

export default ProductListPage;
