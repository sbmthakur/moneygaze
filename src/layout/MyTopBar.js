import { tokens } from "../theme/colorTokens";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Link,
} from "@mui/material";
import { useProSidebar } from "react-pro-sidebar";
import { useColorStore } from "../store/colorStore";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useUserStore } from "../store/userStore";

const MyTopBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const toggleColorMode = useColorStore((state) => state.toggleColorMode);
  const { toggleSidebar, collapseSidebar, broken } = useProSidebar();
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const userInCookie = Cookies.get("moneygaze-user");
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // simulate logout
  const handleLogout = () => {
    Cookies.remove("moneygaze-user");
    setUser(null);
    router.replace("/login");
  };

  const checkUserInCookie = () => {
    if (userInCookie) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUserInCookie();
  }, [userInCookie]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={1.5}
    >
      <Box display="flex" alignItems="center">
        {isUserLoggedIn && broken && (
          <IconButton onClick={toggleSidebar} sx={{ margin: "0 6 0 2" }}>
            <MenuOutlined />
          </IconButton>
        )}
        <Box display="flex" p={0.2} ml={1}>
          <Typography variant="h3" fontWeight="bold">
            MoneyGaze
          </Typography>
        </Box>
      </Box>
      <Box display="flex">
        <IconButton onClick={toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>

        {isUserLoggedIn ? (
          <>
            <IconButton>
              <Avatar
                alt="Profile image"
                src={user?.user_image}
                sx={{ width: 27, height: 27 }}
              >
                {user?.first_name[0]}
              </Avatar>
            </IconButton>
            <Button onClick={handleLogout} sx={{ color: colors.grey[100] }}>
              Logout
            </Button>
          </>
        ) : (
          <Button>
            <Link
              href="/login"
              component={NextLink}
              underline="none"
              sx={{ color: colors.grey[100] }}
            >
              Login
            </Link>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default MyTopBar;
