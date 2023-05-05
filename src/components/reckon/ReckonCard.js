import { tokens } from "../../theme/colorTokens";
import { AddCircleOutline } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
} from "@mui/material";

const customStyles = (colors, theme) => ({
  card: {
    width: "100% !important",
    background: `${colors.primary[400]}`,
    boxShadow: theme.shadows[10],
    // background: `none !important`,
    // transition: "all .25s",
    "&:hover": {
      //   transform: "scale(1.02)",
      cursor: "pointer",
      boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
    },
    padding: "0.7rem",
  },

  cardMedia: {
    aspectRatio: "13.5/9",

    width: "100%",
  },

  cardTitle: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    typography: { sm: "body1", xs: "h6", md: "h6" },
  },
});

export const ReckonCard = ({ cardData, openModalHandler }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const styles = customStyles(colors, theme);

  return (
    <Tooltip title="Click to know more" arrow>
      <Card sx={styles.card} onClick={() => openModalHandler(cardData)}>
        <CardMedia
          sx={styles.cardMedia}
          image={cardData.image}
          title={cardData.name.split("\n")[0]}
        />
        <CardContent
          sx={{
            padding: 0,
            paddingTop: ".9rem",
            ":last-child": {
              paddingBottom: "0",
            },
          }}
        >
          <Typography sx={styles.cardTitle} gutterBottom component="div">
            {cardData.name.split("\n")[0]}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
          {cardData.reward_rate}
        </Typography> */}
        </CardContent>
        {/* <CardActions>
        <IconButton aria-label="add to favorites">
          <AddCircleOutline />
        </IconButton>
      </CardActions> */}
      </Card>
    </Tooltip>
  );
};
