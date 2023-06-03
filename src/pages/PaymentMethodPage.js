import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Radio,
  Button,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../store/cart";

const PaymentMethodPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress, cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);

  const [paymentMethod, setPaymentMethod] = useState("paypal");

  if (!shippingAddress.address) {
    navigate("/shipping");
  }

  useEffect(() => {
    !userInfo?.id && navigate("/login");
    !cartItems?.length && navigate("/cart");
    !shippingAddress?.address && navigate("/shipping-address");
  }, [navigate, userInfo]);

  const handleContinue = () => {
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps activeStep={3} />

      <Typography
        variant="body1"
        sx={{ fontWeight: 550, fontSize: 18, alignSelf: "start", my: 2 }}
      >
        Payment Method
      </Typography>

      <RadioGroup
        name="payment-method"
        aria-labelledby="payment-method"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <FormControlLabel
          control={<Radio color="default" />}
          label="PayPal or Credit Card"
          value="paypal"
        />
        <FormControlLabel
          control={<Radio color="default" />}
          label="Cash on Delivery"
          value="cash"
        />
        <FormControlLabel
          disabled
          control={<Radio color="default" />}
          label="Lipa Na Mpesa (Coming Soon)"
          value="mpesa"
        />
      </RadioGroup>

      <Button
        variant="contained"
        color="inherit"
        sx={{ mt: 2, alignSelf: "end" }}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </FormContainer>
  );
};

export default PaymentMethodPage;
