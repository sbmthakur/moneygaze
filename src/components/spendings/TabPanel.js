import { useTheme, Box } from "@mui/material";
import dynamic from "next/dynamic";
import { tokens } from "@/src/theme/colorTokens";
import { useEffect, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const categories = [
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
];

const columnChartOptions = {
  dataLabels: {
    enabled: true,
  },
  grid: {
    strokeDashArray: 0,
  },
};

export const TabPanel = ({ value, chartData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [options, setOptions] = useState(columnChartOptions);

  const series = [
    {
      name: "Spendings",
      data: [...chartData],
    },
  ];

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
          offsetX: 0,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 400,
          animateGradually: {
            enabled: false,
            // delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      colors: [colors.greenAccent[500], colors.blueAccent[500]],

      xaxis: {
        categories: categories.slice(value * 4, value * 4 + 4),
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
        borderColor: theme.palette.neutral.dark,
      },
      tooltip: {
        theme: theme.palette.mode === "dark" ? "dark" : "light",
        // x: {
        //   format: "dd MMM yyyy",
        // },
      },
    }));
  }, [theme, value]);

  return (
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
        type="bar"
        height={300}
        width={"100%"}
        fontFamily={theme.typography.fontFamily}
      />
    </Box>
  );
};
