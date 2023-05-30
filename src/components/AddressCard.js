import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  IconButton,
  Stack,
  Card,
  CardContent,
  Tooltip,
  CardActions,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";

import { updateUserAddress, deleteUserAddress } from "../store/user";

const AddressCard = ({ address, showDeleteButton }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSetAsDefault = () => {
    dispatch(updateUserAddress(address._id, { ...address, is_default: true }));
  };

  const handleDeleteAddress = () => {
    dispatch(deleteUserAddress(address._id));
  };

  const handleEditClick = () => {
    navigate(`/profile/addresses/${address._id}`);
  };

  return (
    <Card>
      <CardContent
        sx={{
          bgcolor: grey[200],
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18 }}>
          {address.first_name} {address.last_name}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 16 }}>
          {address.address}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 16 }}>
          {address.city}, {address.country}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 16 }}>
          {address.phone_number}
        </Typography>
        {address.is_default ? (
          <Typography
            variant="body1"
            color="green"
            sx={{ fontWeight: 500, fontSize: 16 }}
          >
            Default Address
          </Typography>
        ) : (
          <br />
        )}
      </CardContent>

      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          color="inherit"
          variant="contained"
          sx={{ fontWeight: 550, textTransform: "initial" }}
          disabled={address.is_default}
          onClick={handleSetAsDefault}
        >
          Set as Default
        </Button>

        <Stack direction="row" spacing={1}>
          {showDeleteButton && (
            <Tooltip title="Delete" arrow enterDelay={200} leaveDelay={200}>
              <IconButton onClick={handleDeleteAddress}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Edit" arrow enterDelay={200} leaveDelay={200}>
            <IconButton onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default AddressCard;
