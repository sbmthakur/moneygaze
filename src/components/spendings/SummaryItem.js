import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme/colorTokens";

export const SummaryItem = ({ icon, category, amount, description }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      width="100%"
      pr={2}
      py={1}
    >
      <Stack direction="row" alignItems="center" spacing={2} pl={1}>
        {icon}

        <Stack direction="column" width="100%">
          <Typography
            sx={{
              typography: { sm: "h5", xs: "h6" },
              //   textTransform: "capitalize",
              paddingBottom: 0.6,
            }}
          >
            {category}
          </Typography>
          <Typography color={theme.palette.neutral.light}>
            {description}
          </Typography>
        </Stack>
      </Stack>
      <Typography
        color={
          theme.palette.mode === "dark"
            ? colors.greenAccent[500]
            : colors.blueAccent[500]
        }
        sx={{ typography: { sm: "h5", xs: "h6" } }}
        fontWeight="bold"
      >
        ${amount.toLocaleString()}
      </Typography>
    </Stack>
  );
};
