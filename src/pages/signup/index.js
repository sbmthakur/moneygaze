import { Box } from "@mui/material";
// import { makeStyles } from "@mui/styles";
import { SignupForm } from "../../components/signup/SignupForm";
// import { LoginBanner } from "../components/login/LoginBanner";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import { useUserStore } from "@/src/store/userStore";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const signup = () => {
  // const classes = useStyles();
  const router = useRouter();
  const [responseError, setResponseError] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setResponseError(false);
  }, []);

  const signupFormHandler = async (userData) => {
    // try {
    //   const response = await fetch(baseUrl + "/api/register", {
    //     method: "POST",
    //     body: JSON.stringify(userData),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   if (response.status === 200) {
    //     console.log("Managed to come heere");
    //     const data = await response.json();
    //     const token = data.ssotoken;
    //     Cookies.set("moneygaze-user", token);

    //     router.replace("/dashboard", { replace: true });
    //   } else if (response.status === 401) {
    //     setResponseError(true);
    //   }
    // } catch (error) {
    //   console.log(error);
    //   setResponseError(true);
    // }

    try {
      const response = await axios.post(baseUrl + "/api/register", userData);
      const token = response.data.ssotoken;
      Cookies.set("moneygaze-user", token);
      setUser(response.data);
      router.replace("/dashboard");
    } catch (error) {
      console.log(error);
      setResponseError(true);
    }
  };

  const googleLoginHandler = async (credentialResponse) => {
    const credential = { credential: credentialResponse.credential };
    try {
      const response = await axios.post(
        baseUrl + "/api/registerviagoogle",
        credential
      );
      const token = response.data.ssotoken;
      // const token = "ouath";
      Cookies.set("moneygaze-user", token);
      setUser(response.data);
      router.replace("/dashboard");
    } catch (error) {
      console.log(error);
      setResponseError(true);
    }
    router.replace("/dashboard");
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
        onGoogleLoginSubmit={googleLoginHandler}
      />
    </Box>
  );
};

export default signup;
