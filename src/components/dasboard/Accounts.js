import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  Grid,
  Avatar,
  AccordionDetails,
} from "@mui/material";
import { tokens } from "../../theme/colorTokens";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Sync } from "@mui/icons-material";
import SampleData from "../../../sample_data/exchange_public_tokeen_response.json";

export const Accounts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const accounts = SampleData.accounts;
  const accountTypes = Object.keys(accounts);
  const [totalBalanceByAccountType, setTotalBalanceByAccountType] =
    useState(null);
  // function to set loading state to true for 2 seconds
  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    let accountTypeAndTotalBalance = {};

    accountTypes.forEach((accountType) => {
      accountTypeAndTotalBalance[accountType] =
        calculateTotalBalance(accountType);
    });
    setTotalBalanceByAccountType(accountTypeAndTotalBalance);
  }, [accounts]);

  const calculateTotalBalance = (accountType) => {
    const totalBalance = accounts[accountType].reduce((acc, account) => {
      return acc + account.balance;
    }, 0);
    return totalBalance;
  };

  return (
    <Box
      sx={{
        mt: {
          xs: 1.5,
          md: 0,
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">Accounts</Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            size="small"
            variant="text"
            color={theme.palette.mode === "dark" ? "inherit" : "neutral"}
            sx={{ textTransform: "none" }}
            startIcon={
              loading ? (
                <CircularProgress
                  size="1rem"
                  color="inherit"
                  sx={{ mr: 0.25 }}
                />
              ) : (
                <Sync />
              )
            }
            onClick={() => handleLoading()}
          >
            Sync
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            sx={{ textTransform: "none" }}
            onClick={() => alert("Add Account")}
          >
            Add Account
          </Button>
        </Stack>
      </Stack>

      <Box
        backgroundColor={colors.primary[400]}
        borderRadius="10px"
        //   my={2}
        height="100%"
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
        {accountTypes.map((accountType) => (
          <Accordion key={accountType}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id={`panel${accountType}-header`}
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
                // py={0.5}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    alt={accountType}
                    src="/images/finance-1.png"
                    sx={{ width: 27, height: 27 }}
                  />
                  <Typography
                    noWrap
                    sx={{
                      typography: { sm: "h5", xs: "h6" },
                      textTransform: "capitalize",
                      // paddingRight: 2,
                    }}
                  >
                    {accountType}
                  </Typography>
                </Stack>
                <Typography
                  color={
                    theme.palette.mode === "dark"
                      ? colors.greenAccent[500]
                      : colors.blueAccent[500]
                  }
                  sx={{ typography: { sm: "body1", xs: "body2" } }}
                >
                  $
                  {totalBalanceByAccountType &&
                    totalBalanceByAccountType[accountType].toLocaleString()}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                px: 0,
                pt: 0,
              }}
            >
              {
                // map through each account type and display the account name
                accounts[accountType].map((account) => (
                  <Stack
                    key={`${account.acc_num}-${account.acc_name}`}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    py={1}
                    px={2}
                    sx={{
                      "&:not(:last-child)": {
                        borderBottom: `1px solid ${colors.primary[500]}`,
                      },

                      // "&:last-child": {
                      //   paddingBottom: 0,
                      // },
                      // "&:first-of-type": {
                      //   paddingTop: 0,
                      // },
                      // flexWrap: "wrap",
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      columnGap={2}
                      alignItems="center"
                    >
                      <Avatar
                        alt={accountType}
                        src="/images/chase.jpeg"
                        sx={{ width: 27, height: 27 }}
                      />
                      <Stack direction="column" width="100%">
                        <Typography
                          sx={{
                            typography: { sm: "h5", xs: "h6" },
                            textTransform: "capitalize",
                            // paddingRight: 2,
                          }}
                        >
                          {account.acc_name}
                        </Typography>
                        <Typography
                          variant="body1"
                          color={
                            theme.palette.mode === "dark"
                              ? theme.palette.neutral.light
                              : theme.palette.neutral.main
                          }
                        >
                          &#8226;&#8226;&#8226;
                          {account.acc_num} | {account.ins_name}
                        </Typography>
                      </Stack>
                    </Box>

                    <Typography
                      color={
                        theme.palette.mode === "dark"
                          ? colors.greenAccent[500]
                          : colors.blueAccent[500]
                      }
                      sx={{ typography: { sm: "body1", xs: "body2" } }}
                    >
                      $
                      {
                        //display the account balance with commas
                        account.balance.toLocaleString()
                      }
                    </Typography>
                  </Stack>
                ))
              }
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};
