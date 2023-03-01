import React from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme/colorTokens";

export const Transactions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      backgroundColor={colors.primary[400]}
      borderRadius="10px"
      //   my={2}
      p={2}
      boxShadow={theme.shadows[10]}
    >
      <Box height="300px">
        <h1>Transactions</h1>
      </Box>
    </Box>
  );
};
