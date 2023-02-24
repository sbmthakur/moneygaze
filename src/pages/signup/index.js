import { Box } from "@mui/material";
// import { makeStyles } from "@mui/styles";
import { SignupForm } from "../../components/signup/SignupForm";
// import { LoginBanner } from "../components/login/LoginBanner";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
// import { baseUrl } from "../baseUrl";

const baseUrl = "http://localhost:3001";

const customStyles = {
  loginBanner: {
    background: "linear-gradient(180deg, #EA5DEB 0%, #832BE0 100%)",
    textShadow: "2px 2px 2px rgba(0,0,0,0.26)",
  },

  loginForm: {
    display: "flex",
    padding: "0",
    width: "100%",
    height: "calc(100vh - 66px)",
  },
};
const signup = () => {
  // const classes = useStyles();
  const router = useRouter();
  const [responseError, setResponseError] = useState(false);

  useEffect(() => {
    setResponseError(false);
  }, []);

  const signupFormHandler = async (userData) => {
    try {
      const response = await fetch(baseUrl + "/api/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("Managed to come heere");
        const data = await response.json();
        const token = data.ssotoken;
        Cookies.set("moneygaze-user", token);

        router.replace("/dashboard", { replace: true });
      } else if (response.status === 401) {
        setResponseError(true);
      }
    } catch (error) {
      console.log(error);
      setResponseError(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        // alignSelf: "center",
        // border: "2px solid red",
        height: "calc(100vh - 66px)",
        // mt: "10%",
      }}
    >
      <SignupForm
        onSignUpSubmit={signupFormHandler}
        responseError={responseError}
      />
    </Box>
  );
};

export default signup;
