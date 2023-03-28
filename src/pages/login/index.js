// import { LoginBanner } from "../components/login/LoginBanner";
import { LoginForm } from "../../components/login/LoginForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import Cookies from "js-cookie";
import axios from "axios";
import { useUserStore } from "@/src/store/userStore";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const login = () => {
  const router = useRouter();
  // const classes = useStyles();
  const [invalidCredential, setInvalidCredential] = useState(false);
  const [responseError, setResponseError] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setInvalidCredential(false);
    setResponseError(false);
  }, []);

  const loginFormHandler = async (userData) => {
    setInvalidCredential(false);
    setResponseError(false);
    setUserNotFound(false);

    try {
      const response = await axios.post(baseUrl + "/api/login", userData);
      const token = response.data.ssotoken;
      // console.log(response.data);
      Cookies.set("moneygaze-user", token);
      setUser(response.data);
      router.replace("/dashboard");
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 401) {
          setInvalidCredential(true);
        } else if (error.response.status === 404) {
          setUserNotFound(true);
        }
      } else if (err.request) {
        // The client never received a response, and the request was never left
        console.log(err.request);
      } else {
        setResponseError(true);
      }
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
      <LoginForm
        onLoginSubmit={loginFormHandler}
        invalidError={invalidCredential}
        responseError={responseError}
        userNotFound={userNotFound}
        onGoogleLoginSubmit={googleLoginHandler}
      />
    </Box>
  );
};
export default login;
