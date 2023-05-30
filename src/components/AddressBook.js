import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Typography,
  Button,
  Stack,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import AddressCard from "./AddressCard";

import { addressImageUrl } from "../utils/imageUrls";

const AddressBook = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { addresses } = useSelector((state) => state.user);

  let sortedAddresses = [];
  if (addresses.length > 0) {
    sortedAddresses.push(addresses.find((address) => address.is_default));
    sortedAddresses = sortedAddresses.concat(
      addresses.filter((address) => !address.is_default)
    );
  }

  const AddNewAddressButton = () => (
    <Button
      color="inherit"
      variant="contained"
      sx={{
        fontWeight: 550,
        textTransform: "initial",
        mt: isMobile ? 2 : 0,
      }}
      onClick={() => navigate("/profile/addresses/new")}
      fullWidth={isMobile}
    >
      Add New Address
    </Button>
  );

  useEffect(() => {}, [addresses]);

  return (
    <>
      {!isMobile && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18 }}>
            Profile Details
          </Typography>

          <AddNewAddressButton />
        </Stack>
      )}

      {addresses.length > 0 ? (
        <Grid container spacing={1} mt={isMobile ? 0 : 0.5}>
          {sortedAddresses.map((address) => (
            <Grid item xs={12} md={6}>
              <AddressCard
                key={address._id}
                address={address}
                showDeleteButton={!address.is_default}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <img
            src={addressImageUrl}
            alt="No Address"
            width="200px"
            height="200px"
          />
          <Typography variant="body1" sx={{ fontWeight: 520, fontSize: 16 }}>
            You have not added any address yet
          </Typography>
        </Box>
      )}

      {isMobile && <AddNewAddressButton />}
    </>
  );
};

export default AddressBook;
