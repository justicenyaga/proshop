import React from "react";
import { TextField } from "@mui/material";

const FilterNumericInput = ({
  label,
  values,
  setValues,
  blurConditions,
  index,
  step,
  min,
  max,
  props,
}) => {
  let prevValues = [...values];
  let value = values[index];

  const handleChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9.]/g, "");
    prevValues[index] = newValue;
    setValues(prevValues);
  };

  const handleBlur = (event) => {
    const newValue = Number(parseFloat(value).toFixed(2)) || min;
    prevValues[index] = newValue;
    setValues(prevValues);

    if (blurConditions) {
      blurConditions(newValue);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      prevValues[index] = parseFloat(value) + step;
      setValues(prevValues);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      prevValues[index] = parseFloat(value) - step;
      setValues(prevValues);
    }
  };

  return (
    <TextField
      label={label}
      type="number"
      {...props}
      inputProps={{
        pattern: "[0-9]*",
        step,
        min,
        max,
        "data-testid": "amount-input",
      }}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

export default FilterNumericInput;
