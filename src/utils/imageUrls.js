const logoUrl =
  process.env.NODE_ENV === "production"
    ? "https://proshop.blob.core.windows.net/proshop-container/logo.png"
    : "/siteImages/logo.png";

const notFoundUrl =
  process.env.NODE_ENV === "production"
    ? "https://proshop.blob.core.windows.net/proshop-container/404.png"
    : "/siteImages/404.png";

const commentImageUrl =
  process.env.NODE_ENV === "production"
    ? "https://proshop.blob.core.windows.net/proshop-container/no-comment.png"
    : "/siteImages/no-comment.png";

const cartImageUrl =
  process.env.NODE_ENV === "production"
    ? "https://proshop.blob.core.windows.net/proshop-container/shopping-cart.jpg"
    : "/siteImages/shopping-cart.jpg";

const addressImageUrl =
  process.env.NODE_ENV === "production"
    ? "https://proshop.blob.core.windows.net/proshop-container/address.png"
    : "/siteImages/address.png";

export { logoUrl, notFoundUrl, commentImageUrl, cartImageUrl, addressImageUrl };
