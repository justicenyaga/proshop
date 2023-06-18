import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const CustomDialog = ({
  open,
  onCloseHandler,
  title,
  description,
  confirmButton,
}) => {
  const labelledby = title.toLowerCase().trim().split(" ").join("-") + "dialog";
  const describedby =
    title.toLowerCase().trim().split(" ").join("-") + "dialog-description";

  return (
    <Dialog
      open={open}
      onClose={onCloseHandler}
      aria-labelledby={labelledby}
      aria-describedby={describedby}
    >
      <DialogTitle id={labelledby}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={describedby}>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseHandler}>Cancel</Button>
        {confirmButton}
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
