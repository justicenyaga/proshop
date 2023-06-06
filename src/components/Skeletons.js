import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Grid,
  Button,
  Paper,
  List,
  ListItem,
  Typography,
  Stack,
  TextField,
  Rating,
  Breadcrumbs,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import ReviewStar from "./ReviewStar";

const SkeletonWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
});

const ProductSkeleton = () => {
  return (
    <Box
      sx={{
        margin: 0,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 4,
          transform: "scale(1.02)",
          "& .MuiButton-root": {
            visibility: "visible",
          },
        },
      }}
      boxShadow={1}
    >
      <Card sx={{ margin: 0, height: "355px" }}>
        <Skeleton variant="rectangular" height="180px" animation="wave" />
        <CardContent>
          <SkeletonWrapper>
            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="100%" animation="wave" />

            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Rating
                value={0}
                sx={{ "& .MuiRating-icon": { fontSize: "0.8rem" } }}
                readOnly
              />
              <Typography variant="body2" fontSize={11} color="text.secondary">
                (x)
              </Typography>
            </Stack>

            <Skeleton
              variant="text"
              width="40%"
              height="40px"
              animation="wave"
            />
            <Skeleton
              variant="text"
              width="80%"
              height="40px"
              animation="wave"
              sx={{ marginTop: 1, alignSelf: "center" }}
            />
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </Box>
  );
};

const ProductPageSkeleton = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <>
        {isDesktop && (
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
            separator={<NavigateNextIcon fontSize="small" />}
          >
            <Skeleton animation="wave" variant="text" width={150} height={20} />
            <Skeleton animation="wave" variant="text" width={150} height={20} />
            <Skeleton animation="wave" variant="text" width={150} height={20} />

            <Skeleton animation="wave" variant="text" width={250} height={20} />
          </Breadcrumbs>
        )}

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            width={{ xs: "100%", md: "75%" }}
            borderRadius="5px"
            bgcolor="white"
            p={2}
          >
            <Box width={{ xs: "100%", md: "40%" }}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  maxWidth: "100%",
                  pb: "100%",
                }}
              />
            </Box>
            <Stack
              spacing={isDesktop ? 2 : 0}
              width={{ xs: "100%", md: "60%" }}
            >
              <Skeleton
                variant="text"
                width="100%"
                animation="wave"
                sx={{
                  mt: -1.5,
                }}
                height="60px"
              />
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>Brand:</Typography>
                <Skeleton animation="wave" variant="text" width="30%" />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Rating
                  value={0}
                  size={isDesktop ? "medium" : "small"}
                  readOnly
                />
                <Skeleton animation="wave" variant="text" width={50} />
              </Stack>
              <Skeleton
                animation="wave"
                variant="text"
                width={100}
                height={50}
              />
              <Skeleton animation="wave" variant="text" width="30%" />
              <Skeleton
                animation="wave"
                variant="text"
                width="100%"
                height={100}
              />
            </Stack>
          </Stack>

          {isDesktop && (
            <List
              component={Paper}
              sx={{
                bgcolor: "white",
                borderRadius: "5px",
                width: "25%",
                height: "fit-content",
              }}
              disablePadding
            >
              <ListItem>
                <Stack direction="row" alignItems="center" width="100%">
                  <Typography
                    variant="body2"
                    component="div"
                    width="50%"
                    sx={{ fontSize: 16, fontWeight: 600 }}
                  >
                    Status:
                  </Typography>

                  <Skeleton variant="text" width="40%" animation="wave" />
                </Stack>
              </ListItem>

              <Divider />

              <ListItem>
                <Stack direction="row" alignItems="center" width="100%">
                  <Typography
                    variant="body2"
                    component="div"
                    width="50%"
                    sx={{ fontSize: 16, fontWeight: 600 }}
                  >
                    Unit Price:
                  </Typography>

                  <Skeleton variant="text" width="30%" animation="wave" />
                </Stack>
              </ListItem>

              <Divider />
              <ListItem>
                <Stack direction="row" alignItems="center" width="100%">
                  <Typography
                    variant="body2"
                    component="div"
                    width="50%"
                    sx={{ fontSize: 16, fontWeight: 600 }}
                  >
                    Quantity:
                  </Typography>

                  <TextField
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    disabled
                    size="small"
                    value={1}
                    sx={{ width: "50%" }}
                  />
                </Stack>
              </ListItem>

              <Divider />

              <ListItem>
                <Button
                  variant="contained"
                  color="inherit"
                  fullWidth
                  disabled
                  endIcon={<AddShoppingCartIcon />}
                >
                  Add to Cart
                </Button>
              </ListItem>
            </List>
          )}
        </Stack>

        {!isDesktop && (
          <Typography
            variant="body1"
            component="p"
            sx={{ fontSize: 16, fontWeight: 500, mt: 2 }}
          >
            Customer Feedback
          </Typography>
        )}
      </>

      <Box
        mt={2}
        width={isDesktop ? "74%" : "100%"}
        p={isDesktop ? 2 : 0.8}
        borderRadius="5px"
        bgcolor="white"
      >
        {isDesktop ? (
          <Stack
            direction="row"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 550,
                fontSize: isDesktop ? 18 : 16,
              }}
              component="div"
            >
              Customer Feedback
            </Typography>

            <Button
              color="inherit"
              size="medium"
              endIcon={<ExpandMoreIcon fontSize="small" />}
              disabled
            >
              See all
            </Button>
          </Stack>
        ) : (
          <Stack
            direction="row"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={1}
            pr={2.8}
            sx={{
              cursor: "pointer",
            }}
          >
            <Stack direction="column" spacing={0.5}>
              <Typography variant="body2" fontSize={14}>
                Product Rating & Comments
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  width="fit-content"
                  height="20px"
                  border={1}
                  borderColor="#ffc107"
                  alignItems="center"
                  display="flex"
                  justifyContent="center"
                  p={0.5}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 11,
                      color: "#ffc107",
                    }}
                  >
                    <strong>x.x</strong>
                    /5
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 14,
                  }}
                >
                  x verified ratings
                </Typography>
              </Stack>
            </Stack>
            <ExpandMoreIcon fontSize="small" />
          </Stack>
        )}

        <Divider sx={{ mx: isDesktop ? -2 : -0.8 }} />

        <Stack
          mt={isDesktop ? 2 : 1}
          spacing={isDesktop ? 2 : 1}
          direction={isDesktop ? "row" : "column"}
        >
          {isDesktop && (
            <Stack
              direction={isDesktop ? "column" : "row"}
              width={isDesktop ? "25%" : "100%"}
              p={0.5}
              spacing={2}
            >
              {isDesktop && (
                <Typography variant="subtitle2" fontSize={16}>
                  Rating (x)
                </Typography>
              )}
              <Box
                sx={{
                  mt: isDesktop ? 1 : 0,
                  p: isDesktop ? 2 : 0.8,
                  width: isDesktop ? "100%" : "50%",
                  minWidth: "140px",
                  borderRadius: "5px",
                  boxShadow: 2,
                  bgcolor: grey[300],
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                elevation={2}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#ffc107",
                  }}
                >
                  x.x/5
                </Typography>

                <Rating
                  value={0}
                  color="#ffc107"
                  precision={0.1}
                  sx={{ my: 2 }}
                  size={isDesktop ? "medium" : "small"}
                  readOnly
                />

                <Typography
                  variant="body2"
                  textAlign="center"
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  x verified ratings
                </Typography>
              </Box>

              <Box width="100%" mt={isDesktop ? 1 : 0}>
                <Stack direction="column" mt={1} alignItems="center">
                  <ReviewStar starValue={5} starReviews={0} totalReviews={0} />
                  <ReviewStar starValue={4} starReviews={0} totalReviews={0} />
                  <ReviewStar starValue={3} starReviews={0} totalReviews={0} />
                  <ReviewStar starValue={2} starReviews={0} totalReviews={0} />
                  <ReviewStar starValue={1} starReviews={0} totalReviews={0} />
                </Stack>
              </Box>
            </Stack>
          )}
          <Box width={isDesktop ? "75%" : "100%"} p={isDesktop ? 0.5 : 0}>
            {isDesktop && (
              <Typography variant="subtitle2" mb={1} fontSize={16}>
                Comments (x)
              </Typography>
            )}

            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  mb: 0.8,
                  width: "100%",
                  height: "fit-content",
                  borderRadius: "5px",
                  boxShadow: 2,
                  bgcolor: grey[300],
                }}
                elevation={2}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Skeleton variant="text" width={isDesktop ? "25%" : "50%"} />

                  <Rating
                    value={0}
                    color="#ffc107"
                    size={isDesktop ? "medium" : "small"}
                    readOnly
                  />
                </Stack>

                <Skeleton
                  animation="wave"
                  variant="text"
                  width="100%"
                  height={80}
                />

                <Stack
                  direction="row"
                  alignItems="center"
                  mt={2}
                  mb={-1}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {new Date().toLocaleDateString()}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    display="flex"
                  >
                    <TaskAltIcon color="success" fontSize="small" />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 12,
                        color: "success.main",
                        fontWeight: 500,
                      }}
                    >
                      Verified Purchase
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>
    </>
  );
};

const HomePageHeaderCategorySkeleton = () => {
  const [categoryHovered, setCategoryHovered] = useState(false);

  const handleCategoryHover = () => {
    setCategoryHovered(true);
  };

  const handleCategoryLeave = () => {
    setCategoryHovered(false);
  };

  return (
    <Stack
      direction="row"
      bgcolor="white"
      height="295px"
      width="40%"
      sx={{ cursor: "pointer", borderRadius: "5px" }}
      boxShadow={1}
    >
      <Box
        onMouseEnter={handleCategoryHover}
        onMouseLeave={handleCategoryLeave}
        sx={{
          width: categoryHovered ? "50%" : "100%",
          cursor: "pointer",
          padding: 2,
        }}
        component={Paper}
      >
        {[...Array(10)].map((_, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            width="100%"
            height="27px"
          >
            <Skeleton variant="text" width="20px" animation="wave" />
            <Skeleton
              key={index}
              variant="text"
              animation="wave"
              width="180px"
            />
          </Stack>
        ))}
      </Box>

      <Divider orientation="vertical" flexItem />

      {categoryHovered && (
        <Box
          width="50%"
          onMouseEnter={handleCategoryHover}
          onMouseLeave={handleCategoryLeave}
          sx={{
            padding: 2,
          }}
          component={Paper}
        >
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              variant="text"
              animation="wave"
              width="100%"
              height="20px"
            />
          ))}
        </Box>
      )}
    </Stack>
  );
};

const CategoryGridItemSkeleton = () => {
  return (
    <Stack direction="column" spacing={1} width="100%" alignItems="center">
      <Skeleton
        variant="circular"
        width="60px"
        height="60px"
        animation="wave"
      />
      <Skeleton variant="text" width="75%" height="18px" animation="wave" />
    </Stack>
  );
};

const HomePageHotCategoriesSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        paddingTop={1}
        paddingX={1}
        alignItems="center"
      >
        <Skeleton variant="circular" width="35px" height="35px" />
        <Skeleton variant="text" width="30%" height="40px" />
      </Stack>

      <Grid
        container
        spacing={1}
        height={"80%"}
        sx={{
          borderRadius: "5px",
          marginTop: 1,
          marginLeft: 0.1,
          paddingRight: 0.5,
          "& .MuiGrid-item": {
            width: "20%",
            height: "50%",
            padding: 2,
            "&:hover": {
              elevation: 3,
              boxShadow: 3,
              transform: "scale(1.02)",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "1px solid #e0e0e0",
          },
        }}
      >
        {Array.from({ length: isMobile ? 8 : 10 }, (_, i) => (
          <Grid item key={i} xs={isMobile ? 3 : 0}>
            <CategoryGridItemSkeleton />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const OrderItemSkeleton = ({ isMobile }) => {
  return (
    <Box
      border={1}
      borderColor="divider"
      borderRadius={2}
      p={isMobile ? 1 : 2}
      mt={1}
      sx={isMobile ? { cursor: "pointer" } : {}}
    >
      <Stack
        direction="row"
        alignItems="center"
        width="100%"
        height="fit-content"
        spacing={1}
      >
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            minHeight: "60px",
            width: isMobile ? "20%" : "10%",
            height: "100%",
          }}
        />

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
          height="100%"
        >
          <Stack direction="column" width="100%" height="100%">
            <Skeleton animation="wave" variant="text" width="80%" />

            <Typography
              variant="body2"
              component="div"
              sx={{
                fontSize: isMobile ? 11 : 14,
                fontWeight: 450,
                mb: 1,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                Order No:{" "}
                <Skeleton animation="wave" variant="text" width="40px" />
              </Stack>
            </Typography>

            <Skeleton
              animation="wave"
              variant="rectangular"
              width="150px"
              height="20px"
              sx={{ borderRadius: "10px" }}
            />
          </Stack>

          {!isMobile && (
            <Button
              color="inherit"
              sx={{
                width: "120px",
                fontWeight: 550,
                alignSelf: "start",
                mt: -1,
              }}
              disabled
            >
              <Skeleton animation="wave" variant="text" width="90%" />
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export {
  ProductSkeleton,
  ProductPageSkeleton,
  HomePageHeaderCategorySkeleton,
  HomePageHotCategoriesSkeleton,
  OrderItemSkeleton,
};
