import { tokens } from "@/src/theme/colorTokens";
import {
  Box,
  List,
  ListItem,
  useTheme,
  Stack,
  Typography,
} from "@mui/material";
import { SummaryItem } from "./SummaryItem";
import { AddCircleTwoTone, RemoveCircleTwoTone } from "@mui/icons-material";

export const SummaryList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const categoryData = [
    {
      icon: (
        <AddCircleTwoTone
          sx={{
            color: colors.greenAccent[400],
            fontSize: "27px",
          }}
        />
      ),
      category: "Income",
      amount: 0,
      description: "0 income events",
    },
    {
      icon: (
        <RemoveCircleTwoTone
          sx={{
            color: colors.blueAccent[400],
            fontSize: "27px",
          }}
        />
      ),
      category: "Bills",
      amount: 5.75,
      description: "$255 less than March",
    },
    {
      icon: (
        <RemoveCircleTwoTone
          sx={{
            color: theme.palette.neutral.main,
            fontSize: "27px",
          }}
        />
      ),
      category: "Spending",
      amount: 821.8,
      description: "$698 more than March",
    },
  ];

  return (
    <Box>
      <Stack
        sx={{
          pt: { md: 1.2 },
          pb: { md: 0.7 },
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5">Summary</Typography>
        <Typography color={theme.palette.neutral.main} variant="h6">
          Apr 1 - Apr 24
        </Typography>
      </Stack>
      <Box
        backgroundColor={colors.primary[400]}
        borderRadius="10px"
        //   my={2}
        // p={2}
        boxShadow={theme.shadows[10]}
        sx={{ mt: 1.5 }}
      >
        <List
          sx={{
            "& .MuiListItem-root": {
              borderBottom: `1px solid ${colors.primary[500]}`,
              "&:last-child": {
                borderBottom: "none",
              },
            },
          }}
        >
          {categoryData.map((category, index) => (
            <ListItem key={index}>
              <SummaryItem {...category} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
