import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  List,
  ListItem,
  useTheme,
  Typography,
  Stack,
  Switch,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import dynamic from "next/dynamic";
import { tokens } from "@/src/theme/colorTokens";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const donoutChartOptions = {
  chart: {
    //  id: 'basic-donut'
    type: "donut",
  },

  legend: {
    show: true,
  },
  responsive: [
    {
      breakpoint: 769,
      options: {
        // chart: {
        //   width: 200,
        // },
        legend: {
          position: "bottom",
          fontSize: "10px",
        },
      },
    },
  ],
};

const labelList = [
  "Grocery",
  "Auto & Transport",
  "Shopping",
  "Personal Care",
  "Dining & Drinks",
];

const seriesList = [44.5, 55, 13, 43, 22];

export const SpendingsDonut = () => {
  const theme = useTheme();
  const [series, setSeries] = useState(seriesList);
  const [options, setOptions] = useState(donoutChartOptions);

  const colors = tokens(theme.palette.mode);
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    // console.log(event.target.checked);
  };

  useEffect(() => {
    let index = series.indexOf(Math.max(...series))
    let category = labelList[index]
    sessionStorage.setItem('category', category)
  }, [])

  useEffect(() => {
    if (checked) {
      setOptions((prev) => ({
        ...prev,
        labels: [...labelList, "Bills & Utilities"],
      }));

      setSeries((prev) => [...seriesList, 30.25]);
    } else {
      setOptions((prev) => ({
        ...prev,
        labels: labelList,
      }));

      setSeries(seriesList);
    }
  }, [checked]);

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      stroke: {
        show: true,
        width: 1,
        colors: [colors.primary[400]],
      },
      tooltip: {
        fillSeriesColor: false,
        theme: theme.palette.mode === "dark" ? "dark" : "light",
      },
      legend: {
        labels: {
          colors: theme.palette.neutral.light,
        },
        fontSize: "14px",
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#F9CE1D",
      ],
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
            labels: {
              show: true,
              name: {
                show: true,
                // fontSize: "20px",
              },
              value: {
                show: true,
                // fontSize: "20px",
                fontWeight: "bold",
                color:
                  theme.palette.mode === "dark"
                    ? "#fff"
                    : theme.palette.neutral.light,
                formatter: function (w) {
                  // float value prefixed with $ upto two decimals
                  return "$" + parseFloat(w).toFixed(2);
                },
              },
              total: {
                show: true,
                showAlways: true,
                // fontSize: "20px",

                color: theme.palette.neutral.light,
                formatter: function (w) {
                  // return sum as float with 2 decimals prefixed with $
                  return (
                    "$" +
                    w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(2)
                  );
                },
              },
            },
          },
        },
      },
    }));
  }, [theme]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Spendings Breakdown</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={handleChange}
                sx={{
                  "& .MuiSwitch-thumb": {
                    // color: `${colors.primary[400]} !important`,
                    color:
                      theme.palette.mode === "light" &&
                      theme.palette.neutral.main,
                    boxShadow: theme.shadows[10],
                  },
                  "&  .Mui-checked .MuiSwitch-thumb ": {
                    color: `${colors.greenAccent[500]} !important`,
                  },
                  "& .Mui-checked+.MuiSwitch-track": {
                    backgroundColor: `${colors.greenAccent[500]} !important`,
                  },
                }}
              />
            }
            label="Include bills"
            labelPlacement="start"
            sx={{
              "& .MuiTypography-root": {
                fontSize: "12px",

                color: theme.palette.neutral.light,
              },
            }}
          />
        </FormGroup>
      </Stack>
      <Box
        backgroundColor={colors.primary[400]}
        borderRadius="10px"
        //   my={2}
        p={2}
        boxShadow={theme.shadows[10]}
        sx={{ mt: 1.5 }}
        overflow={"hidden"}
      >
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={350}
          width={"100%"}
          fontFamily={theme.typography.fontFamily}
        />
      </Box>
    </Box>
  );
};
