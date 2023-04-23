import React, { useEffect } from "react";
import { Grid, useTheme, Tab, Tabs, Box, List, ListItem } from "@mui/material";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function ItemCard(props) {

  const { category, amount, description } = props;
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      flexDirection: 'column', 
      height: '100%',
      width: '100%'

      }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{category}</span>
        <span sx={{ textAlign: 'right' }}>{'$' + amount}</span>
      </Box>
      <Box>
        <span>{description}</span>
      </Box>
    </Box>
  )
}

function TabPanel(props) {

  const { index, value, chartData } = props;

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
        mode: 'light'
      },
      xaxis: {
        categories: categories[index]
      },
    },
    series: [
      {
        name: 'series-1',
        data: chartData,
        color: 'white'
      }, /*{
        name: 'series-2',
        data: [80, 38, 45, 53]
      }*/
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
  const [chartData, setChartData] = React.useState([])
  const [donutData, setDonutData] = React.useState([])
  const [categoryData, setCategoryData] = React.useState([])

  useEffect(() => {
    setChartData([70, 45, 45, 50])
    setDonutData([44, 55, 13, 43, 22])
    const catData = [{
      title: 'Income',
      amount: 0,
      description: '0 income events'
    },
    {
      title: 'Bills',
      amount: 5.75,
      description: '$255 less than Nov'
    },
    {
      title: 'Spending',
      amount: 821.80,
      description: '$698 more than Nov'
    }
    ]
    setCategoryData(catData)
  }, [])

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
    series: donutData
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
          //boxShadow={3}
          //bgcolor="background.paper"
            sx={{
              boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)",
              p: 2
            }}
          >
          <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="This is tabs"
          >
            <Tab label="Last Quarter" />
            <Tab label="This Quarter" />
            {/*
            <Tab label="Custom" />
  */}

          </Tabs>
          <TabPanel index={0} value={value} chartData={chartData} />
          <TabPanel index={1} value={value} chartData={chartData} />
          <TabPanel index={2} value={value} chartData={chartData} />
          </Box>
        </Grid>
        <Grid item xs={8}>
          <p>SPENDING BREAKDOWN</p>
          <Box
            sx={{
              boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)",
              p: 2
            }}
          >
          <ReactApexChart options={donutChart.options} series={donutChart.series} type="donut" height={350} />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <h1>Show Other data</h1>
          <p>SUMMARY</p>
          <Box
            sx={{
              boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)",
              p: 2
            }}
          >
            <List>

              {
                categoryData.map((o, index) => {
                  return <ListItem>
                    <ItemCard category={o.title} amount={o.amount} description={o.description} />
                  </ListItem>
                })
              }
            </List>
            </Box>
        </Grid>
      </Grid>
    </>
  )
};

export default spendings;
