import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { TableBody, TableCell, TableRow, Checkbox } from "@mui/material";
import { grey } from "@mui/material/colors";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { TableRowSkeleton } from "./Skeletons";

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

const CustomTableBody = (props) => {
  const {
    order,
    orderBy,
    secProperty,
    orderByType,
    selected,
    onItemClick,
    page,
    rowsPerPage,
    data,
    loading,
    pk,
    bodyCells,
    actionButtons,
  } = props;

  const numColumns = bodyCells.length + 2;
  const isSelected = (item) => selected.indexOf(item) !== -1;

  const visibleRows = useMemo(
    () =>
      stableSort(
        data,
        getComparator(order, orderBy, orderByType, secProperty)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data, orderByType, secProperty]
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <TableBody>
      {loading
        ? Array.from(new Array(10)).map((_, index) => (
            <TableRowSkeleton key={index} columns={numColumns} />
          ))
        : visibleRows.map((item, index) => {
            const isItemSelected = isSelected(item[pk]);
            const labelId = `order-table-checkbox-${index}`;

            return (
              <TableRow
                hover
                onClick={(event) => onItemClick(event, item[pk])}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={item[pk]}
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

                {bodyCells.map((bodyCell) => (
                  <TableCell align="center">
                    {bodyCell.sec_property ? (
                      item[bodyCell.key][bodyCell.sec_property]
                    ) : bodyCell.key === "user" ? (
                      `${item[bodyCell.key][bodyCell.first_name]} ${
                        item[bodyCell.key][bodyCell.last_name]
                      }`
                    ) : bodyCell.type === "date" ? (
                      item[bodyCell.key] ? (
                        new Date(item[bodyCell.key]).toLocaleDateString("en-GB")
                      ) : (
                        <CloseIcon color="error" />
                      )
                    ) : bodyCell.type === "bool" ? (
                      item[bodyCell.key] ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )
                    ) : (
                      item[bodyCell.key] || <CloseIcon color="error" />
                    )}
                  </TableCell>
                ))}

                <TableCell align="center">
                  {
                    actionButtons.find(
                      (actionButton) => actionButton.id === item[pk]
                    ).buttons
                  }
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
  );
};

CustomTableBody.propTypes = {
  data: PropTypes.array.isRequired,
  pk: PropTypes.string.isRequired,
  bodyCells: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  selected: PropTypes.array.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  secProperty: PropTypes.string.isRequired,
  orderByType: PropTypes.string.isRequired,
  onItemClick: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  actionButtons: PropTypes.array.isRequired,
};

export default CustomTableBody;
