import {
  Grid,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const CategoryGridItem = ({ image, label, onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid item component={Stack} onClick={onClick} xs={isMobile ? 3 : 0}>
      <Stack
        direction="column"
        spacing={1}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <img
          src={image}
          alt={label}
          style={{
            height: "60px",
            width: "60px",
            borderRadius: "50%",
          }}
          loading="lazy"
        />
        <Typography
          variant="subtitle1"
          component="div"
          sx={{
            fontWeight: 550,
            textAlign: "center",
            lineHeight: 1.1,
            fontSize: 10,
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Grid>
  );
};

export default CategoryGridItem;
