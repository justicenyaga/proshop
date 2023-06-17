import React, { useState } from "react";
import { Box, Table, TableContainer, TablePagination } from "@mui/material";
import PropTypes from "prop-types";

import TableToolbar from "./TableToolbar";
import TableHead from "./TableHead";
import TableBody from "./TableBody";

const CustomTable = (props) => {
  const {
    tableTitle,
    data,
    pk,
    loading,
    headCells,
    bodyCells,
    toolBarSelectedActions,
    toolBarMainActions,
    rowActionButtons,
    selected,
    setSelected,
  } = props;

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("orderNo");
  const [secProperty, setSecProperty] = useState(null);
  const [orderByType, setOrderByType] = useState("number");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property, type, sec_prop) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setOrderByType(type);
    setSecProperty(sec_prop);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((item) => item[pk]);
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
      <TableToolbar
        tableTitle={tableTitle}
        numSelected={selected.length}
        selectedActionButtons={toolBarSelectedActions}
        mainActionButtons={toolBarMainActions}
        loading={loading}
      />
      <TableContainer>
        <Table
          sx={{ minWidth: 850 }}
          aria-labelledby="orders-table"
          size="small"
          stickyHeader
        >
          <TableHead
            headCells={headCells}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            loading={loading}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />

          <TableBody
            bodyCells={bodyCells}
            pk={pk}
            data={data}
            actionButtons={rowActionButtons}
            onItemClick={handleClick}
            order={order}
            orderBy={orderBy}
            secProperty={secProperty}
            orderByType={orderByType}
            selected={selected}
            page={page}
            rowsPerPage={rowsPerPage}
            loading={loading}
          />
        </Table>
      </TableContainer>
      <TablePagination
        size="small"
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

CustomTable.propTypes = {
  tableTitle: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  pk: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  headCells: PropTypes.array.isRequired,
  bodyCells: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  toolBarSelectedActions: PropTypes.array,
  toolBarMainActions: PropTypes.array,
  rowActionButtons: PropTypes.array,
};

export default CustomTable;
