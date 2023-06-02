import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Stack, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";

import { saveShippingAddress } from "../store/cart";

import { addressImageUrl } from "../utils/imageUrls";

const AddressPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, shippingAddress: addressFromRedux } = useSelector(
    (state) => state.cart
  );
  const { userInfo, addresses } = useSelector((state) => state.user);

  const reduxAddressExistsInAddresses = addresses.some(
    (address) => address._id === addressFromRedux?._id
  );

  const shippingAddress =
    addressFromRedux?._id && reduxAddressExistsInAddresses
      ? addressFromRedux
      : addresses.find((address) => address.is_default);

  useEffect(() => {
    !userInfo?.id && navigate("/login");
    cartItems?.length === 0 && navigate("/cart");
  }, [navigate, userInfo]);

  const handleContinue = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress(shippingAddress));
    navigate("/payment");
  };

  return (
    <>
      <FormContainer>
        <CheckoutSteps activeStep={2} />

        <Stack
          direction="row"
          width="100%"
          spacing={2}
          my={2}
          justifyContent="space-between"
        >
          <Typography variant="body1" sx={{ fontWeight: 550, fontSize: 18 }}>
            Shipping Address
          </Typography>

          {addresses.length > 0 && (
            <Button onClick={() => navigate("/checkout/addresses")}>
              Change
            </Button>
          )}
        </Stack>

        {addresses.length > 0 ? (
          <>
            <Box width="100%">
              <Typography
                variant="body1"
                sx={{ fontWeight: 520, fontSize: 18 }}
              >
                {shippingAddress?.first_name} {shippingAddress?.last_name}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 16 }}
              >
                {shippingAddress?.address}
                {" - "} {shippingAddress?.city} {shippingAddress?.postal_code}
                {", "} {shippingAddress?.country}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, fontSize: 16 }}
              >
                {shippingAddress?.phone_number}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="inherit"
              sx={{ mt: 2, alignSelf: "end" }}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <img
              src={addressImageUrl}
              alt="No Address"
              width="200px"
              height="200px"
            />
            <Typography variant="body1" sx={{ fontWeight: 520, fontSize: 16 }}>
              You have not created any address yet
            </Typography>

            <Button
              variant="contained"
              color="inherit"
              sx={{ mt: 2, textTransform: "initial", fontWeight: 550 }}
              onClick={() =>
                navigate("/profile/addresses/new?r=/shipping-address")
              }
            >
              Create a New Address
            </Button>
          </>
        )}
      </FormContainer>
    </>
  );
};

export default AddressPage;
