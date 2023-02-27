import React from "react";
import { Box, Stack, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme/colorTokens";

export const Accounts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      backgroundColor={colors.primary[400]}
      borderRadius="10px"
      //   my={2}
      height="100%"
      p={2}
      boxShadow={theme.shadows[10]}
      // border={`2px solid ${borderColor}}`}
    >
      <Box height="300px">
        <h1>Account List</h1>
      </Box>
    </Box>
  );
};
