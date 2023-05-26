const redirectUri =
  process.env.NODE_ENV === "production"
    ? "https://www.localhost:3000"
    : "http://localhost:3000/";

export default redirectUri;
