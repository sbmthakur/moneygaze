import { useEffect, useState } from "react";

import { useTheme, Tab, Tabs, Box } from "@mui/material";
import { TabPanel } from "./TabPanel";

export const SpendingsTab = () => {
  const [value, setValue] = useState(0);
  const [chartData, setChartData] = useState([70, 45, 45, 50]);

  useEffect(() => {
    value === 0
      ? setChartData([70, 45, 80, 50])
      : setChartData([80, 38, 70, 23]);
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="This is tabs"
      >
        <Tab label="Last Quarter" sx={{ textTransform: "none" }} />
        <Tab label="This Quarter" sx={{ textTransform: "none" }} />
      </Tabs>
      <TabPanel value={value} chartData={chartData} />
    </Box>
  );
};
