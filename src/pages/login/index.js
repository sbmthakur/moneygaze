// import { LoginBanner } from "../components/login/LoginBanner";
import { LoginForm } from "../../components/login/LoginForm";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import Cookies from "js-cookie";

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
const baseUrl = "http://localhost:3001";
const login = () => {
  const router = useRouter();
  // const classes = useStyles();
  const [invalidCredential, setInvalidCredential] = useState(false);
  const [responseError, setResponseError] = useState(false);

  useEffect(() => {
    setInvalidCredential(false);
    setResponseError(false);
  }, []);

  const loginFormHandler = async (userData) => {
    setInvalidCredential(false);
    setResponseError(false);

    try {
      const response = await fetch(baseUrl + "/api/login", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        const token = data.ssotoken;
        Cookies.set("moneygaze-user", token);
        router.push("/dashboard", { replace: true });
      } else if (response.status === 403) {
        setInvalidCredential(true);
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
      <LoginForm
        onLoginSubmit={loginFormHandler}
        invalidError={invalidCredential}
        responseError={responseError}
      />
    </Box>
  );
};
export default login;
