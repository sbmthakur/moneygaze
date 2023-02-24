// return morning, afternoon, evening, or night
export const getTimePeriod = () => {
  const date = new Date();
  const hours = date.getHours();

  if (hours >= 4 && hours < 12) {
    return "Good morning,";
  } else if (hours >= 12 && hours < 16) {
    return "Good afternoon,";
  } else if (hours >= 16 && hours < 20) {
    return "Good evening,";
  } else {
    return "Hello,";
  }
};
