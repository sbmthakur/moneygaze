import { Box, Button } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const login = () => {
  const router = useRouter();

  const handleLogin = () => {
    // simulate login
    console.log("login");
    Cookies.set("moneygaze-user", "shubham");
    router.replace("/");
  };

  return (
    <div>
      <Box>
        <h1>Login Page</h1>
        <Box>
          <Button
            variant="filled"
            onClick={handleLogin}
            sx={{
              backgroundColor: "lightblue",
              color: "black",
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default login;
