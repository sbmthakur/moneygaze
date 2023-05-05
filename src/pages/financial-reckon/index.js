import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";

import { useCategoryStore } from "@/src/store/categoryStore";
import { ReckonList } from "@/src/components/reckon/ReckonList";
import { ReckonModal } from "@/src/components/reckon/ReckonModal";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const financialreckon = () => {
  const [cardList, setCardList] = useState([]);
  const category = useCategoryStore((state) => state.category);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  useEffect(() => {
    const catMap = {
      "Auto & Transport": "travel",
      "Dining & Drinks": "restaurants",
    };

    let url = baseUrl + "/api/info";

    if (category) {
      url += `?qtype=${catMap[category]}`;
    }

    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        setCardList(data);
      });
  }, []);

  const openModalHandler = (card) => {
    console.log(card);
    setOpenModal(true);
    setSelectedCard(card);
  };

  const closeModalHandler = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Box m="20px">
        <Typography variant="h3">
          Credit Card recommendations for you.
        </Typography>
        <Box mt={3}>
          {/* <Grid container rowSpacing={3}>
          {cardData.map((r) => {
            return (
              <Grid item container spacing={3}>
                <Grid item>
                  <img src={r.image} />
                </Grid>
                <Grid item>
                  <ul style={{ listStyleType: "none" }}>
                    <li>
                      <strong>Annual fee: </strong>
                      {r.annual_fee}
                    </li>
                    <li>
                      Suggested for Credit Score in the range:{" "}
                      <strong>{r.recommended}</strong>
                    </li>
                    <li>
                      <i>{r.reward_rate}</i>
                    </li>
                  </ul>
                </Grid>
              </Grid>
            );
          })}
        </Grid> */}
          <ReckonList cardList={cardList} openModalHandler={openModalHandler} />
        </Box>
      </Box>
      {openModal && (
        <ReckonModal
          card={selectedCard}
          isOpen={openModal}
          closeModalHandler={closeModalHandler}
        />
      )}
    </>
  );
};

export default financialreckon;
