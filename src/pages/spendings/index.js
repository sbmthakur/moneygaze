import React, { useEffect } from "react";
import { Grid, Box, List, ListItem } from "@mui/material";

import { SpendingsTab } from "@/src/components/spendings/SpendingsTab";
import { SpendingsDonut } from "@/src/components/spendings/SpendingsDonut";
import { SummaryList } from "@/src/components/spendings/SummaryList";

const spendings = () => {
  return (
    <Box m="20px">
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <SpendingsTab />
        </Grid>
        <Grid item xs={12} md={7} sx={{ mt: 1.5 }}>
          <SpendingsDonut />
        </Grid>
        <Grid item xs={12} md={5} sx={{ mt: 1.5 }}>
          <SummaryList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default spendings;
