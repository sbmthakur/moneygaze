import React, { useEffect } from "react";
import { Grid, Box, List, ListItem } from "@mui/material";
import dynamic from "next/dynamic";
import { SpendingsTab } from "@/src/components/spendings/SpendingsTab";
import { SpendingsDonut } from "@/src/components/spendings/SpendingsDonut";
import { SummaryList } from "@/src/components/spendings/SummaryList";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function ItemCard(props) {
  const { category, amount, description } = props;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <span>{category}</span>
        <span sx={{ textAlign: "right" }}>{"$" + amount}</span>
      </Box>
      <Box>
        <span>{description}</span>
      </Box>
    </Box>
  );
}

const spendings = () => {
  const [categoryData, setCategoryData] = React.useState([]);

  useEffect(() => {
    const catData = [
      {
        title: "Income",
        amount: 0,
        description: "0 income events",
      },
      {
        title: "Bills",
        amount: 5.75,
        description: "$255 less than Mar",
      },
      {
        title: "Spending",
        amount: 821.8,
        description: "$698 more than Mar",
      },
    ];
    setCategoryData(catData);
  }, []);

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
          {/* <h1>Show Other data</h1>
          <p>SUMMARY</p>
          <Box
            sx={{
              boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)",
              p: 2,
            }}
          >
            <List>
              {categoryData.map((o, index) => {
                return (
                  <ListItem key={index}>
                    <ItemCard
                      category={o.title}
                      amount={o.amount}
                      description={o.description}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box> */}
          <SummaryList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default spendings;
