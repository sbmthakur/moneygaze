import { Box, useTheme, Stack, Button, Typography } from "@mui/material";
import { tokens } from "../../theme/colorTokens";
import GraphData from "../../../sample_data/sample_graph_data.json";
import dynamic from "next/dynamic";
import { useChartStore } from "@/src/store/chartStore";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import { useEffect, useRef, useState } from "react";

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    id: "expense-chart",
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
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
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
  xaxis: {
    // min: new Date("01 Mar 2012").getTime(),

    type: "datetime",
  },
};

export const ExpenseChart = ({ chartHeight }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const slot = useChartStore((state) => state.chartSlot);
  const setSlot = useChartStore((state) => state.setChartSlot);
  const [options, setOptions] = useState(areaChartOptions);

  const [series, setSeries] = useState([
    {
      name: "Expense",
      data: GraphData,
    },
  ]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,

      colors: [colors.greenAccent[500], colors.blueAccent[500]],
      xaxis: {
        // min: new Date("01 Mar 2012").getTime(),

        type: "datetime",
        tickAmount: 6,

        labels: {
          style: {
            colors: theme.palette.neutral.light,
          },
        },
        axisBorder: {
          show: true,
          color: theme.palette.neutral.main,
        },
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
        x: {
          format: "dd MMM yyyy",
        },
      },
      legend: {
        labels: {
          colors: theme.palette.neutral.light,
        },
      },
    }));
  }, [theme]);

  //   const series= useState(GraphData);

  const current = new Date("2013-02-26");
  const start = new Date(current - 7 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    if (slot === "week") {
      setOptions((prevState) => ({
        ...prevState,
        xaxis: {
          ...prevState.xaxis,
          min: start.getTime(),
          max: current.getTime(),
        },
      }));
    } else {
      setOptions((prevState) => ({
        ...prevState,
        xaxis: {
          ...prevState.xaxis,
          min: new Date("2013-01-27").getTime(),
          max: new Date("2013-02-26").getTime(),
        },
      }));
    }
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
          height={chartHeight}
          width={"100%"}
          fontFamily={theme.typography.fontFamily}
        />
      </Box>
    </Box>
  );
};
