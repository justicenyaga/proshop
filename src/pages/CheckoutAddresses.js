import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Chip,
  Typography,
  Button,
  Stack,
  Box,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";

import { saveShippingAddress } from "../store/cart";

const CheckoutAddresses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const [selectedAddressId, setSelectedAddressId] = useState("");

  const { addresses } = useSelector((state) => state.user);
  const { shippingAddress } = useSelector((state) => state.cart);

  const shippingExistsInAddresses = addresses.some(
    (address) => address._id === shippingAddress._id
  );

  let sortedAddresses = [];
  if (addresses.length > 0) {
    sortedAddresses.push(addresses.find((address) => address.is_default));
    sortedAddresses = sortedAddresses.concat(
      addresses.filter((address) => !address.is_default)
    );
  }

  useEffect(() => {
    shippingAddress?._id && shippingExistsInAddresses
      ? setSelectedAddressId(shippingAddress._id)
      : addresses.length > 0 &&
        setSelectedAddressId(
          addresses.find((address) => address.is_default)._id
        );
  }, [addresses]);

  const handleSelectAddress = () => {
    const address = addresses.find(
      (address) => address._id === Number(selectedAddressId)
    );
    dispatch(saveShippingAddress(address));
    navigate("/shipping-address");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        borderRadius: "10px",
        boxShadow: 3,
        width: isMobile ? "100%" : isTablet ? "80%" : "60%",
        margin: "0 auto",
        marginTop: isMobile ? "8px" : isTablet ? "16px" : "40px",
        px: isTablet ? 5 : isMobile ? 2 : 8,
        py: 3,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18, mb: 2 }}>
        Address Book ({addresses.length})
      </Typography>

      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          aria-label="address"
          name="radio-buttons-group"
          value={selectedAddressId}
          onChange={(e) => setSelectedAddressId(e.target.value)}
        >
          {sortedAddresses.map((address) => (
            <Box
              key={address._id}
              border={1}
              borderColor={grey[300]}
              borderRadius={2}
              p={2}
              mb={0.8}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <FormControlLabel
                  value={address._id}
                  control={<Radio color="default" />}
                  label={
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, fontSize: 16 }}
                      >
                        {address.first_name} {address.last_name}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, fontSize: 16 }}
                      >
                        {address.address}
                        {" - "} {address.city} {address.postal_code}
                        {", "} {address.country}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, fontSize: 16 }}
                      >
                        {address.phone_number}
                      </Typography>
                      {address.is_default && (
                        <Chip label="Default Address" color="default" />
                      )}
                    </Box>
                  }
                />
                <Button
                  color="inherit"
                  sx={{
                    fontWeight: 550,
                    textTransform: "initial",
                    alignSelf: "start",
                    mt: -1,
                  }}
                  onClick={() =>
                    navigate(
                      `/profile/addresses/${address._id}?r=/checkout/addresses`
                    )
                  }
                  endIcon={<EditIcon fontSize="small" />}
                >
                  Edit
                </Button>
              </Stack>
            </Box>
          ))}
        </RadioGroup>
      </FormControl>

      <Button
        color="inherit"
        variant="outlined"
        sx={{ fontWeight: 550, textTransform: "initial", alignSelf: "start" }}
        onClick={() => navigate("/profile/addresses/new?r=/checkout/addresses")}
        fullWidth={isMobile}
      >
        Add New Address
      </Button>

      <Divider sx={{ mt: 2, mb: 1 }} />

      <Stack direction="row" alignItems="center" spacing={2} alignSelf="end">
        <Button
          color="inherit"
          variant="text"
          sx={{ fontWeight: 550 }}
          onClick={() => navigate("/shipping-address")}
        >
          Cancel
        </Button>
        <Button
          color="inherit"
          variant="contained"
          sx={{ fontWeight: 550 }}
          onClick={handleSelectAddress}
        >
          Select Address
        </Button>
      </Stack>
    </Box>
  );
};

export default CheckoutAddresses;
