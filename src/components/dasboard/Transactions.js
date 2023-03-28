import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  Box,
  Stack,
  Typography,
  useTheme,
  AccordionSummary,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme/colorTokens";
import SampleData from "../../../sample_data/exchange_public_tokeen_response.json";

export const Transactions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const transactions = SampleData.transactions;

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ mt: 1.5 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">Recent Transactions</Typography>
        <Typography color={theme.palette.neutral.main} variant="h6">
          You've had {`${transactions.length}`} transactions so far this month
        </Typography>
      </Stack>
      <Box
        backgroundColor={colors.primary[400]}
        borderRadius="10px"
        // height={300}
        // p={2}
        boxShadow={theme.shadows[10]}
        sx={{
          mt: 1.5,

          "& .MuiPaper-root": {
            backgroundColor: "transparent !important",
            backgroundImage: "none !important",
            boxShadow: "none !important",
            margin: "0 !important",
            "&:before": {
              backgroundColor: "transparent !important",
            },
            "&:not(:last-child)": {
              borderBottom: `1px solid ${colors.primary[500]}`,
            },
          },
          "& .MuiAccordian-root": {
            backgroundColor: "transparent !important",
            backgroundImage: "none !important",
            boxShadow: "none !important",
          },
        }}
      >
        {transactions.map((transaction, idx) => (
          <Accordion
            // disableGutters
            key={`transaction-${idx}`}
            expanded={expanded === `panel${idx + 1}`}
            onChange={handleChange(`panel${idx + 1}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id={`panel${idx + 1}a-header`}
              sx={{
                "& .MuiAccordionSummary-expandIconWrapper": {
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.neutral.main
                      : theme.palette.neutral.dark,
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
                pr={2}
              >
                <Grid container spacing={{ sm: 3, xs: 2 }}>
                  <Grid item xs="auto">
                    <Typography
                      sx={{
                        typography: { sm: "body1", xs: "body2" },
                        // flexShrink: 0,
                      }}
                    >
                      {transaction.date}
                    </Typography>
                  </Grid>
                  <Grid item xs={7} sm="auto">
                    <Typography
                      noWrap
                      sx={{
                        typography: { sm: "body1", xs: "body2" },
                        // paddingRight: 2,
                      }}
                    >
                      {transaction.name}
                    </Typography>
                  </Grid>
                </Grid>

                <Typography
                  color={
                    theme.palette.mode === "dark"
                      ? colors.greenAccent[500]
                      : colors.blueAccent[500]
                  }
                  sx={{ typography: { sm: "body1", xs: "body2" } }}
                >
                  {transaction.amount < 0
                    ? `-$${Math.abs(transaction.amount)}`
                    : `$${transaction.amount}`}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="column" spacing={2}>
                <Typography color={theme.palette.neutral.light}>
                  Transaction Id: {transaction.id}
                </Typography>
                <Typography color={theme.palette.neutral.light}>
                  Payment Channel:{" "}
                  {transaction.payment_metadata.payment_channel}
                </Typography>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};
