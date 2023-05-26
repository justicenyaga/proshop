import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { loadOrderDetails } from "../store/orderDetails";
import { payOrder, resetOrderPay } from "../store/orderPay";
import { deliverOrder, deleteOrderDeliver } from "../store/orderList";

const OrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: orderId } = useParams();

  const reduxState = useSelector((state) => state);

  const { order, loading, error } = reduxState.orderDetails;
  const { success: successPay, loading: loadingPay } = reduxState.orderPay;
  const { userInfo } = reduxState.user;
  const { success: successDeliver, loading: loadingDeliver } =
    reduxState.orderList.orderDeliver;

  const [sdkReady, setSdkReady] = useState(false);

  let itemsPrice = 0;

  if (!loading && !error) {
    itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AS5LcoTOrmwavIBTbinGY62cjZCCQGAeZ2CGoR0eBDBqTGkw7rwJgjLU5mr4wmhBu1jLn9mKMIf2nK_d";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  console.log(order.paymentMethod);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (
        !Object.keys(order).length ||
        successPay ||
        successDeliver ||
        order._id !== Number(orderId)
      ) {
        if (successPay) toast.success("Order Paid");
        if (successDeliver) toast.success("order delivered");
        dispatch(resetOrderPay());
        dispatch(deleteOrderDeliver());
        dispatch(loadOrderDetails(orderId));
      } else if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [dispatch, order, successPay, successDeliver, orderId]);

  const handleSuccessPayment = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const handleDeliverOrder = () => {
    dispatch(deliverOrder(orderId));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <Row>
        <h1>Order Number: {order._id}</h1>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>

              <p>
                <strong>
                  Email:{" "}
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </strong>
              </p>

              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}
                {"  "}
                {order.shippingAddress.postalCode},{"  "}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on: {order.deliveredAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on: {order.paidAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="warning">Not paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>

              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.productId}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items: </Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping: </Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax: </Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total: </Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && order.paymentMethod === "PayPal" && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={handleSuccessPayment}
                    />
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                !order.isPaid &&
                order.paymentMethod === "Cash on Delivery" && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn w-100"
                      onClick={() => handleSuccessPayment({})}
                    >
                      Mark as Paid
                    </Button>
                  </ListGroup.Item>
                )}

              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn w-100"
                      onClick={handleDeliverOrder}
                    >
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderPage;
