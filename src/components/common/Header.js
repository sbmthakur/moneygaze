import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../theme/colorTokens";

export const Header = ({ title1, title2, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const smScreen = useMediaQuery(theme.breakpoints.up("xs"));

  return (
    <Box mb="30px">
      <Box
        display={smScreen ? "flex" : "block"}
        flexDirection={smScreen ? "row" : "column"}
        // justifyContent={smScreen ? "space-between" : "start"}
        alignItems={smScreen ? "center" : "start"}
      >
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ mb: "5px" }}
        >
          {title1}
        </Typography>
        {title2 && (
          <Typography
            variant="h2"
            color={
              theme.palette.mode === "dark"
                ? colors.blueAccent[400]
                : colors.blueAccent[500]
            }
            fontWeight="bold"
            sx={{ mb: "5px", ml: `${smScreen && "7px"}` }}
          >
            {title2}
          </Typography>
        )}
      </Box>

      <Typography variant="h5" color={colors.blueAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};
