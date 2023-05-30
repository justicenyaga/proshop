import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Checkbox,
  Autocomplete,
  FormControlLabel,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { MuiTelInput } from "mui-tel-input";
import { Country, City } from "country-state-city";
import { toast } from "react-toastify";

import { updateUserAddress, addUserAddress } from "../store/user";

const AddressEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { section } = useParams();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { addresses } = useSelector((state) => state.user);
  const addressToEdit = addresses.find(
    (address) => address._id === Number(section)
  );

  const countries = Country.getAllCountries().map((country) => ({
    name: country.name,
    isoCode: country.isoCode,
    flag: country.flag,
  }));

  const [cityOptions, setCityOptions] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState({});
  const [city, setCity] = useState({});
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
  };

  const conditionToShowIsDefaultCheck =
    (addresses.length === 1 && section === "new") || addresses.length > 1;

  useEffect(() => {
    !conditionToShowIsDefaultCheck && setIsDefault(true);

    if (section !== "new") {
      !addressToEdit && navigate("/profile/addresses");

      setFirstName(addressToEdit.first_name);
      setLastName(addressToEdit.last_name);
      setPhoneNumber(addressToEdit.phone_number);
      setAddress(addressToEdit.address);
      setCountry(
        countries.find((country) => country.name === addressToEdit.country)
      );
      setCity({ name: addressToEdit.city });
      setPostalCode(addressToEdit.postal_code);
      setIsDefault(addressToEdit.is_default);
      setCityOptions(
        City.getCitiesOfCountry(
          countries.find((country) => country.name === addressToEdit.country)
            .isoCode
        ).map((city) => ({ name: city.name }))
      );
    }
  }, [addresses]);

  const handleCountryChange = (event, newValue) => {
    setCountry(newValue);
    setCity(null);

    if (newValue) {
      const cities = City.getCitiesOfCountry(newValue.isoCode);
      setCityOptions(cities.map((city) => ({ name: city.name })));
    } else {
      setCityOptions([]);
    }
  };

  const renderCustomTextField = (label, value, setValue) => {
    return (
      <TextField
        fullWidth
        label={label}
        name={label}
        variant="outlined"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Enter ${label}...`}
      />
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      address,
      city: city?.name,
      postal_code: postalCode,
      country: country?.name,
      is_default: isDefault,
    };

    if (section === "new") {
      dispatch(addUserAddress(data));
      toast.success("Address added successfully");
      navigate("/profile/addresses");
    } else {
      dispatch(updateUserAddress(section, data));
      toast.success("Address updated successfully");
      navigate("/profile/addresses");
    }
  };

  return (
    <>
      {!isMobile && (
        <Typography
          variant="body1"
          sx={{ fontWeight: 550, fontSize: 18, mb: 2 }}
        >
          {section === "new" ? "Add a New Address" : "Edit Address"}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Stack
          direction="row"
          spacing={isMobile ? 0.5 : 2}
          justifyContent="space-between"
        >
          {renderCustomTextField("First Name", firstName, setFirstName)}
          {renderCustomTextField("Last Name", lastName, setLastName)}
        </Stack>

        <MuiTelInput
          label="Phone Number"
          value={phoneNumber}
          onChange={handlePhoneChange}
          required
          placeholder="Enter phone number..."
          fullWidth={isMobile}
          sx={{ my: 2 }}
        />

        <Stack
          direction="row"
          spacing={isMobile ? 0.5 : 2}
          justifyContent="space-between"
        >
          <Autocomplete
            value={country}
            onChange={handleCountryChange}
            options={countries}
            fullWidth
            getOptionLabel={(option) => (option?.name ? option.name : "")}
            renderOption={(props, option) => (
              <li {...props}>
                <span>{option?.flag}</span> {" " + option?.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Country"
                variant="outlined"
              />
            )}
          />
          <Autocomplete
            value={city}
            onChange={(event, newValue) => setCity(newValue)}
            options={cityOptions}
            fullWidth
            getOptionLabel={(option) => (option?.name ? option.name : "")}
            renderInput={(params) => (
              <TextField {...params} required label="City" variant="outlined" />
            )}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={isMobile ? 0.5 : 2}
          my={2}
          justifyContent="space-between"
        >
          {renderCustomTextField("Postal Code", postalCode, setPostalCode)}
          {renderCustomTextField("Address", address, setAddress)}
        </Stack>

        {conditionToShowIsDefaultCheck && (
          <FormControlLabel
            label="Set as default address"
            control={
              <Checkbox
                checked={isDefault}
                color="default"
                disabled={addressToEdit?.is_default}
                onChange={(e) => setIsDefault(e.target.checked)}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            }
          />
        )}

        <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
          <Button
            variant="contained"
            color="inherit"
            size="large"
            startIcon={<SaveIcon />}
            type="submit"
            sx={{
              fontSize: 18,
              fontWeight: 550,
              width: isMobile ? "100%" : "40%",
            }}
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddressEdit;
