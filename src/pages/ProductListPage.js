import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { loadProducts, createProduct, deleteProduct } from "../store/products";

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxState = useSelector((state) => state);
  const {
    productsList: products,
    loading,
    error,
    successCreate,
    successDelete,
  } = reduxState.products;
  const { userInfo } = reduxState.user;

  useEffect(() => {
    if (successCreate) {
      const createdProduct = reduxState.products.createdProduct;
      navigate(`/admin/products/${createdProduct._id}`);
    }

    if (!userInfo.isAdmin) {
      navigate("/login");
    } else {
      dispatch(loadProducts());
    }
  }, [dispatch, navigate, userInfo, successCreate, successDelete]);

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?"))
      dispatch(deleteProduct(productId));
  };

  const handleCreateProduct = () => {
    dispatch(createProduct());
  };

  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>

        <Col className="text-end">
          <Button className="my-3" onClick={handleCreateProduct}>
            <i className="fa fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover bordered responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Brand</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category && product.category.name}</td>
                <td>{product.category && product.category.sub_category}</td>
                <td>{product.brand}</td>

                <td>
                  <LinkContainer to={`/admin/products/${product._id}`}>
                    <Button variant="light" className="btn btn-sm">
                      <i className="fa fa-edit"></i>
                    </Button>
                  </LinkContainer>

                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <i className="fa fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ProductListPage;
