const redirectUri =
  process.env.NODE_ENV === "production"
    ? "https://proshop-eshop.web.app/"
    : "http://localhost:3000/";

export default redirectUri;
