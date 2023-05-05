import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme,
  CardMedia,
} from "@mui/material";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import { tokens } from "../../theme/colorTokens";

export const ReckonModal = ({ card, isOpen, closeModalHandler }) => {
  console.log(card);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(isOpen);
  const handleClose = () => {
    setOpen(false);
    closeModalHandler();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
      scroll="paper"
      disablePortal
      sx={{
        zIndex: 20000,
        "& .MuiDialog-paper": {
          backgroundColor: `${colors.primary[400]}`,
          backgroundImage: "none",
          boxShadow: `${theme.shadows[10]}`,
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          display: "flex",
          //   border: "1px solid red",
          justifyContent: "flex-end",
          padding: 0.5,
        }}
      >
        <IconButton onClick={handleClose}>
          <Close
            sx={{
              color: `${
                theme.palette.mode === "dark"
                  ? theme.palette.neutral.light
                  : theme.palette.neutral.main
              }`,
            }}
          />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          px: 2,
          mb: 1,
          //   border: "1px solid green",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <CardMedia
            sx={{
              aspectRatio: "13.5/9",

              width: "100%",
              borderRadius: "10px",
            }}
            image={card.image}
            title={card.name.split("\n")[0]}
          />

          <Box>
            <Typography
              sx={{
                mt: 2,
                typography: { sm: "h3", xs: "h4" },
              }}
            >
              {card.name.split("\n")[0]}
            </Typography>
            <Typography
              sx={{
                mt: 2,
                typography: { sm: "h5", xs: "h6" },
                fontWeight: "400 !important",
              }}
            >
              Rewards: {card.reward_rate}
            </Typography>

            <Typography
              sx={{
                mt: 2,
                typography: { sm: "h5", xs: "h6" },
                fontWeight: "400 !important",
              }}
            >
              Annual Fee: {card.annual_fee}
            </Typography>

            <Typography
              sx={{
                mt: 2,
                typography: { sm: "h5", xs: "h6" },
                fontWeight: "400 !important",
              }}
            >
              Suggested Credit Score range: {card.recommended}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
