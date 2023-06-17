import React from "react";
import { Toolbar, Typography, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import PropTypes from "prop-types";

const CustomTableToolbar = (props) => {
  const {
    tableTitle,
    numSelected,
    selectedActionButtons,
    mainActionButtons,
    loading,
  } = props;

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
          {tableTitle}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Stack direction="row" spacing={1}>
          {selectedActionButtons &&
            selectedActionButtons.length > 0 &&
            selectedActionButtons.map((Button, index) => (
              <Button key={index} />
            ))}
        </Stack>
      ) : (
        <Stack direction="row" spacing={1}>
          {mainActionButtons &&
            mainActionButtons.length > 0 &&
            mainActionButtons.map((Button, index) => <Button key={index} />)}
        </Stack>
      )}
    </Toolbar>
  );
};

CustomTableToolbar.propTypes = {
  tableTitle: PropTypes.string.isRequired,
  numSelected: PropTypes.number.isRequired,
  selectedActionButtons: PropTypes.array,
  mainActionButtons: PropTypes.array,
  loading: PropTypes.bool,
};

export default CustomTableToolbar;
