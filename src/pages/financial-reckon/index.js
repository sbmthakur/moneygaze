import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const financialreckon = () => {
  const [cardData, setCardData] = useState([])

  useEffect(() => {

    const catMap = {
      "Auto & Transport": "travel",
      "Dining & Drinks": "restaurants"
    }

    const category = sessionStorage.getItem('category')

    let url = baseUrl + '/api/info'

    if (category) {
      url += `?qtype=${catMap[category]}`
    }

    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        setCardData(data)
      })
  }, [])

  return <Grid container rowSpacing={3}>
    {cardData.map(r => {
      return <Grid item container spacing={3}>
        <Grid item>
          <img src={r.image} />
        </Grid>
        <Grid item>
          <ul style={{ listStyleType: 'none' }}>
            <li>
              <strong>Annual fee: </strong>{r.annual_fee}
            </li>
            <li>
              Suggested for Credit Score in the range: <strong>{r.recommended}</strong>
            </li>
            <li>
              <i>{r.reward_rate}</i>
            </li>
          </ul>
        </Grid>
      </Grid>
    })}
  </Grid>
  
};

export default financialreckon;
