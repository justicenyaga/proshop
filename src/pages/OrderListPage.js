import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  Tooltip,
  IconButton,
  Typography,
  Toolbar,
  Checkbox,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Box,
  Stack,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { grey } from "@mui/material/colors";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PayIcon from "@mui/icons-material/PriceCheck";
import DeliverIcon from "@mui/icons-material/WhereToVoteOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { TableRowSkeleton } from "../components/Skeletons";

import { payOrder, payMultiple, resetOrderPay } from "../store/orderPay";
import {
  loadOrders,
  deliverOrder,
  deliverMultipleOrders,
  deleteOrderDeliver,
} from "../store/orderList";

function descendingComparator(a, b, type, orderBy, secondary) {
  let x, y;

  if (secondary) {
    x = a[orderBy][secondary];
    y = b[orderBy][secondary];
  } else {
    x = a[orderBy];
    y = b[orderBy];
  }

  if (type === "string") {
    x = x?.toLowerCase();
    y = y?.toLowerCase();
  }

  if (type === "date") {
    x = new Date(x);
    y = new Date(y);
  }

  if (type === "decimal") {
    x = parseFloat(x);
    y = parseFloat(y);
  }

  if (type === "number") {
    x = parseInt(x);
    y = parseInt(y);
  }

  if (y < x) {
    return -1;
  }
  if (y > x) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy, type, secondary) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, type, orderBy, secondary)
    : (a, b) => -descendingComparator(a, b, type, orderBy, secondary);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

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

const CustomTableHead = (props) => {
  const {
    loading,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property, type, sec_prop) => (event) => {
    onRequestSort(event, property, type, sec_prop);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="default"
            disabled={loading}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all orders",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding="none"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(
                headCell.id,
                headCell.type,
                headCell.sec_property
              )}
              sx={{
                fontWeight: 530,
              }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

CustomTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const CustomTableToolbar = (props) => {
  const { numSelected, actions, loading } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        mb: 1,
        ...(numSelected > 0 && {
          bgcolor: grey[300],
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} {numSelected === 1 ? "order" : "orders"} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%", fontWeight: 550, fontSize: 20 }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Orders
        </Typography>
      )}

      {numSelected > 0 && (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Mark as Paid">
            <IconButton onClick={actions[0]} disabled={loading}>
              <PayIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark as Delivered">
            <IconButton onClick={actions[1]} disabled={loading}>
              <DeliverIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Toolbar>
  );
};

CustomTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const OrderListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("orderNo");
  const [secProperty, setSecProperty] = useState(null);
  const [orderByType, setOrderByType] = useState("number");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const reduxState = useSelector((state) => state);
  const { orders, loading, error } = reduxState.orderList;
  const { loading: processingPayments, success: ordersPaid } =
    reduxState.orderPay;
  const { success: ordersDelivered, loading: processingDeliveries } =
    reduxState.orderList.orderDeliver;
  const { userInfo } = reduxState.user;

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
  }, [dispatch, navigate, userInfo, ordersPaid, ordersDelivered]);

  const handleRequestSort = (event, property, type, sec_prop) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setOrderByType(type);
    setSecProperty(sec_prop);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = orders.map((order) => order._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, order) => {
    const selectedIndex = selected.indexOf(order);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, order);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMarkAsPaid = async (orderId) => {
    await dispatch(payOrder(orderId, {}));
    toast.success("Order marked as paid");
  };

  const handleMarkAsDelivered = async (orderId) => {
    await dispatch(deliverOrder(orderId));
    toast.success("Order marked as delivered");
  };

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

  const isSelected = (order) => selected.indexOf(order) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(
        orders,
        getComparator(order, orderBy, orderByType, secProperty)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, orders, orderByType, secProperty]
  );

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
      }}
    >
      <CustomTableToolbar
        numSelected={selected.length}
        actions={[handleMarkSelectedAsPaid, handleMarkSelectedAsDelivered]}
        loading={loading || processingPayments || processingDeliveries}
      />
      <TableContainer>
        <Table
          sx={{ minWidth: 850 }}
          aria-labelledby="orders-table"
          size="small"
          stickyHeader
        >
          <CustomTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            loading={loading || processingPayments || processingDeliveries}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={orders.length}
          />
          <TableBody>
            {loading || processingPayments || processingDeliveries
              ? Array.from(new Array(10)).map((_, index) => (
                  <TableRowSkeleton key={index} columns={9} />
                ))
              : visibleRows.map((order, index) => {
                  const isItemSelected = isSelected(order._id);
                  const labelId = `order-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, order._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={order._id}
                      sx={{
                        cursor: "pointer",
                        bgcolor: isItemSelected ? grey[300] : "white",
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="default"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        align="center"
                      >
                        {order._id}
                      </TableCell>
                      <TableCell align="left">
                        {`${order.user.first_name} ${order.user.last_name}`}
                      </TableCell>
                      <TableCell align="left">
                        {new Date(order.createdAt).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell align="left">{order.totalPrice}</TableCell>
                      <TableCell align="left">{order.paymentMethod}</TableCell>
                      <TableCell align="left">
                        {order.isPaid ? (
                          new Date(order.paidAt).toLocaleDateString("en-GB")
                        ) : (
                          <CloseIcon color="error" />
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {order.isDelivered ? (
                          new Date(order.deliveredAt).toLocaleDateString(
                            "en-GB"
                          )
                        ) : (
                          <CloseIcon color="error" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row">
                          <Tooltip enterDelay={500} title="Details">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/orders/${order._id}`);
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
                                  handleMarkAsPaid(order._id);
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
                                  handleMarkAsDelivered(order._id);
                                }}
                              >
                                <DeliverIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 33 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        size="small"
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default OrderListPage;
