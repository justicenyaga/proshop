import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Step,
  StepLabel,
  Stepper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const CheckoutSteps = ({ activeStep }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const steps = ["Login", "Cart", "Address", "Payment", "Place Order"];

  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((step) => (
        <Step key={step}>
          <StepLabel
            StepIconProps={{
              style: {
                color:
                  activeStep > steps.indexOf(step)
                    ? "green"
                    : activeStep === steps.indexOf(step)
                    ? "blue"
                    : "grey",
                cursor:
                  activeStep > steps.indexOf(step) ? "pointer" : "default",
              },
            }}
            onClick={
              activeStep > steps.indexOf(step)
                ? () => navigate(`/${step.toLowerCase()}`)
                : null
            }
          >
            {step}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutSteps;
