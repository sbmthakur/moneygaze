import React from "react";
import { Grid, useTheme, Tab, Tabs } from "@mui/material";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});


function TabPanel(props) {

  const { index, value } = props;

  const categories = []
  categories.push(['January', 'February', 'March', 'April'])
  categories.push( ['May', 'June', 'July', 'Aug'])
  categories.push(['Sept', 'Oct', 'Nov', 'Dec'])

  const columnChart = {
    options: {
      chart: {
        type: 'bar'
      },
      theme:{
        mode: 'dark'
      },
      xaxis: {
        categories: categories[index]
      }
    },
    series: [
      {
        name: 'series-1',
        data: [30, 40, 45, 50],
        color: 'white'
      }, {
        name: 'series-2',
        data: [80, 38, 45, 53]
      }
    ]
  }
  return (

    <>
      <ReactApexChart hidden={value !== index} options={columnChart.options} series={columnChart.series} type="bar" height={350} />
    </>
  )

}

const spendings = () => {

  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }


  const donutChart = {
    options: {
      chart: {
        //  id: 'basic-donut'
        type: 'donut'
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      legend: {
        show: false
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '20px'
              },
              value: {
                show: true,
                fontSize: '20px',
                color: 'white'
              },
              total: {
                show: true,
                showAlways: true,
                fontSize: '20px',
                color: 'white'
              }
            }
          }
        }
      }
    },
    series: [44, 55, 13, 43, 22]
  }
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="This is tabs"
          >
            <Tab label="Last Quarter" />
            <Tab label="This Quarter" />
            <Tab label="Custom" />
          </Tabs>
          <TabPanel index={0} value={value} />
          <TabPanel index={1} value={value} />
          <TabPanel index={2} value={value} />
        </Grid>
        <Grid item xs={8}>
          <p>SPENDING BREAKDOWN</p>
          <ReactApexChart options={donutChart.options} series={donutChart.series} type="donut" height={350} />
        </Grid>
        <Grid item xs={4}>
          <h1>Show Other data</h1>
        </Grid>
      </Grid>
    </>
  )
};

export default spendings;
