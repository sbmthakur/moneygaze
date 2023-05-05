import { Grid } from "@mui/material";
import { ReckonCard } from "./ReckonCard";

export const ReckonList = ({ cardList, openModalHandler }) => {
  return (
    <Grid container spacing={4}>
      {cardList.map((cardData, idx) => {
        return (
          <Grid
            key={idx}
            item
            container
            xs={12}
            sm={4}
            md={3}
            sx={{
              display: "flex",
            }}
          >
            <ReckonCard
              cardData={cardData}
              openModalHandler={openModalHandler}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
