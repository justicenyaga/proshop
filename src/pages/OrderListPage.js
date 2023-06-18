import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, IconButton, Stack } from "@mui/material";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PayIcon from "@mui/icons-material/PriceCheck";
import DeliverIcon from "@mui/icons-material/WhereToVoteOutlined";

import Table from "../components/Table";

import { payOrder, payMultiple, resetOrderPay } from "../store/orderPay";
import {
  loadOrders,
  deliverOrder,
  deliverMultipleOrders,
  deleteOrderDeliver,
} from "../store/orderList";

const headCells = [
  { id: "_id", type: "number", label: "Order No" },
  { id: "user", sec_property: "first_name", type: "string", label: "User" },
  { id: "createdAt", type: "date", label: "Placed On" },
  { id: "totalPrice", type: "decimal", label: "Total ($)" },
  { id: "paymentMethod", type: "string", label: "Payment" },
  { id: "paidAt", type: "date", label: "Paid" },
  { id: "deliveredAt", type: "date", label: "Delivered" },
  { id: "", type: "string", label: "" },
];

const bodyCells = [
  { key: "_id" },
  { key: "user", first_name: "first_name", last_name: "last_name" },
  { key: "createdAt", type: "date" },
  { key: "totalPrice" },
  { key: "paymentMethod" },
  { key: "paidAt", type: "date" },
  { key: "deliveredAt", type: "date" },
];

const getActionButtons = (orders, viewHandler, payHandler, deliverHandler) => {
  let actionButtons = [];

  orders.forEach((order) => {
    actionButtons.push({
      id: order._id,
      buttons: (
        <Stack direction="row">
          <Tooltip enterDelay={500} title="Details">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                viewHandler(order._id);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {!order.isPaid && (
            <Tooltip enterDelay={500} title="Mark as Paid">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  payHandler(order._id);
                }}
              >
                <PayIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {!order.isDelivered && (
            <Tooltip enterDelay={500} title="Mark as Delivered">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  deliverHandler(order._id);
                }}
              >
                <DeliverIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    });
  });

  return actionButtons;
};

const OrderListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxState = useSelector((state) => state);
  const { orders, loading: fetchingOrders, error } = reduxState.orderList;
  const { loading: processingPayments, success: ordersPaid } =
    reduxState.orderPay;
  const { success: ordersDelivered, loading: processingDeliveries } =
    reduxState.orderList.orderDeliver;
  const { userInfo } = reduxState.user;

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (userInfo.is_staff) {
      dispatch(loadOrders());
      if (ordersPaid) {
        dispatch(loadOrders());
        dispatch(resetOrderPay());
      }
      if (ordersDelivered) {
        dispatch(loadOrders());
        dispatch(deleteOrderDeliver());
      }
    } else {
      navigate("/login");
    }
    error && toast.error(error);
  }, [dispatch, navigate, userInfo, ordersPaid, ordersDelivered]);

  const handleMarkSelectedAsPaid = async () => {
    const selectedOrders = orders.filter((order) =>
      selected.includes(order._id)
    );

    const unPaidOrdersIds = selectedOrders
      .filter((order) => !order.isPaid && order.paymentMethod === "cash")
      .map((order) => order._id);

    if (unPaidOrdersIds.length > 0) {
      await dispatch(payMultiple(unPaidOrdersIds));
      toast.success("Orders marked as paid");
    }
  };

  const handleMarkSelectedAsDelivered = async () => {
    const selectedOrders = orders.filter((order) =>
      selected.includes(order._id)
    );

    const unDeliveredOrdersIds = selectedOrders
      .filter(
        (order) =>
          !order.isDelivered &&
          (order.paymentMethod === "cash" ||
            (order.paymentMethod === "paypal" && order.isPaid))
      )
      .map((order) => order._id);

    if (unDeliveredOrdersIds.length > 0) {
      await dispatch(deliverMultipleOrders(unDeliveredOrdersIds));
      toast.success("Orders marked as Delivered");
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleMarkAsPaid = async (orderId) => {
    await dispatch(payOrder(orderId, {}));
    toast.success("Order marked as paid");
  };

  const handleMarkAsDelivered = async (orderId) => {
    await dispatch(deliverOrder(orderId));
    toast.success("Order marked as delivered");
  };

  const MarkOrdersAsPaidButton = () => (
    <Tooltip title="Mark as Paid">
      <IconButton onClick={handleMarkSelectedAsPaid} disabled={fetchingOrders}>
        <PayIcon />
      </IconButton>
    </Tooltip>
  );

  const MarkOrdersAsDeliveredButton = () => (
    <Tooltip title="Mark as Delivered">
      <IconButton
        onClick={handleMarkSelectedAsDelivered}
        disabled={fetchingOrders}
      >
        <DeliverIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <Table
      tableTitle="Orders"
      data={orders}
      pk="_id"
      loading={fetchingOrders || processingPayments || processingDeliveries}
      headCells={headCells}
      bodyCells={bodyCells}
      selected={selected}
      setSelected={setSelected}
      toolBarSelectedActions={[
        MarkOrdersAsPaidButton,
        MarkOrdersAsDeliveredButton,
      ]}
      rowActionButtons={getActionButtons(
        orders,
        handleViewOrder,
        handleMarkAsPaid,
        handleMarkAsDelivered
      )}
    />
  );
};

export default OrderListPage;
