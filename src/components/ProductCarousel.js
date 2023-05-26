import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { loadTopRatedProducts } from "../store/products";

const ProductCarousel = () => {
  const dispatch = useDispatch();

  const productsSlice = useSelector((state) => state.products);
  const { topRatedProducts, loadingTopRated, errorTopRated } = productsSlice;

  useEffect(() => {
    dispatch(loadTopRatedProducts());
  }, [dispatch]);
  return loadingTopRated ? (
    <Loader />
  ) : errorTopRated ? (
    <Message variant="danger">{errorTopRated}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark">
      {topRatedProducts.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h4>
                {product.name} (${product.price})
              </h4>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
