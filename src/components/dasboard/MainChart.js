import { Box, useTheme, Stack, Button, Typography } from "@mui/material";
import { tokens } from "../../theme/colorTokens";

import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import { useEffect, useState } from "react";

// chart options
const areaChartOptions = {
  chart: {
    height: 450,

    type: "area",
    toolbar: {
      show: false,
      offsetX: 0,

      tools: {
        // download: true,
        // selection: true,
        // zoom: true,
        zoomin: true,
        zoomout: true,
        // pan: true,
        reset: true | '<img src="/static/icons/reset.png" width="20">',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  grid: {
    strokeDashArray: 0,
  },
};

export const MainChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [slot, setSlot] = useState("week");
  const [options, setOptions] = useState(areaChartOptions);
  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [colors.greenAccent[500], colors.blueAccent[500]],
      xaxis: {
        categories:
          slot === "week"
            ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            : [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
        labels: {
          style: {
            colors: theme.palette.neutral.light,
          },
        },
        axisBorder: {
          show: true,
          color: theme.palette.neutral.main,
        },
        tickAmmount: slot === "week" ? 7 : 11,
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.palette.neutral.light,
          },
        },
      },
      grid: {
        borderColor: theme.palette.neutral.main,
      },
      tooltip: {
        theme: theme.palette.mode === "dark" ? "dark" : "light",
      },
      legend: {
        labels: {
          colors: theme.palette.neutral.light,
        },
      },
    }));
  }, [slot, theme]);

  const [series, setSeries] = useState([
    {
      name: "expenses",
      data: [0, 86, 28, 115, 48, 210, 136],
    },
    {
      name: "income",
      data: [0, 43, 14, 56, 24, 105, 68],
    },
  ]);

  useEffect(() => {
    setSeries([
      {
        name: "income",
        data:
          slot === "month"
            ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35]
            : [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "expense",
        data:
          slot === "month"
            ? [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41]
            : [11, 32, 45, 32, 34, 52, 41],
      },
    ]);
  }, [slot]);

  const setSlotHandler = (slot) => {
    setSlot(slot);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">Expense Report</Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            size="small"
            variant={slot === "month" ? "outlined" : "text"}
            color={slot === "month" ? "secondary" : "inherit"}
            sx={{ textTransform: "none" }}
            onClick={() => setSlotHandler("month")}
          >
            Month
          </Button>
          <Button
            size="small"
            variant={slot === "week" ? "outlined" : "text"}
            color={slot === "week" ? "secondary" : "inherit"}
            sx={{ textTransform: "none" }}
            onClick={() => setSlotHandler("week")}
          >
            Week
          </Button>
        </Stack>
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
          type="area"
          height={450}
          width={"100%"}
          fontFamily={theme.typography.fontFamily}
        />
      </Box>
    </Box>
  );
};
