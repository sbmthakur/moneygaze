import { useState } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { useProSidebar, menuClasses, sidebarClasses } from "react-pro-sidebar";
import {
  Box,
  Link,
  Typography,
  useTheme,
  IconButton,
  Avatar,
} from "@mui/material";
import NextLink from "next/link";
import { tokens } from "../theme/colorTokens";
import { CloseOutlined, MenuOutlined } from "@mui/icons-material";
import { NavigationLinks } from "./NavigationLinks";
import { useRouter } from "next/router";
import { useUserStore } from "../store/userStore";

const Item = ({ title, to, icon, collapsed, currentPath }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      icon={icon}
      style={{ color: colors.grey[100] }}
      active={currentPath === to}
      // onClick={() => setNavLink(to)}
      component={<Link href={to} component={NextLink} />}
    >
      {!collapsed && (
        <Typography fontWeight={500} variant="h5">
          {title}
        </Typography>
      )}
    </MenuItem>
  );
};

const MySideBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useUserStore((state) => state.user);
  const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();
  // const navLink = useNavLinkStore((state) => state.navLink);
  // const setNavLink = useNavLinkStore((state) => state.setNavLink);

  const router = useRouter();

  return user ? (
    <Box
      sx={{
        position: "sticky",
        display: "flex",
        height: "100vh",
        boxShadow: theme.shadows[10],

        top: 0,
        bottom: 0,
        zIndex: 10000,
        "& .ps-sidebar-root": {
          border: "none !important",
          outline: "none !important",
        },
        "& .ps-menu-icon": {
          backgroundColor: "transparent !important",
        },
        "& .ps-menuitem-root": {
          // padding: "5px 35px 5px 20px !important",
          backgroundColor: "transparent !important",
        },
        "& .ps-menu-button": {
          color: "inherit !important",
          backgroundColor: "transparent !important",

          // border: "2px solid red !important",
        },
        "& .menu-item-links .ps-menuitem-root:hover": {
          // color: `${colors.blueAccent[500]} !important`,
          backgroundColor: `${
            theme.palette.mode === "dark"
              ? colors.primary[500]
              : colors.blueAccent[800]
          } !important`,
          borderRadius: "10px",
        },
        "& .ps-menu-button.ps-active": {
          color: `#fcfcfc !important`,
          backgroundColor: `${colors.blueAccent[500]} !important`,
          borderRadius: "10px",
        },
        "& .menu-item-links .ps-menu-button": {
          padding: `${collapsed ? "6px" : "15px"} !important`,
        },
      }}
    >
      <Sidebar breakPoint="md" backgroundColor={colors.primary[400]}>
        <Menu iconShape="square">
          <MenuItem
            icon={
              collapsed && <MenuOutlined onClick={() => collapseSidebar()} />
            }
          >
            {!collapsed && (
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                // ml={1.5}
                mt={1.5}
              >
                {/* <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={colors.grey[100]}
                >
                  MoneyGaze
                </Typography> */}
                <IconButton
                  onClick={
                    broken ? () => toggleSidebar() : () => collapseSidebar()
                  }
                >
                  <CloseOutlined />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!collapsed && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  "& .avater-image": {
                    backgroundColor: colors.primary[500],
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              >
                <Avatar
                  alt="Profile image"
                  src={user?.user_image}
                  sx={{ width: "100px", height: "100px" }}
                >
                  <Typography variant="h1">{user?.first_name[0]}</Typography>
                </Avatar>
                {/* <img
                  className="avater-image"
                  alt="profile user"
                  width="100px"
                  height="100px"
                  src={user?.user_image}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    objectFit: "contain !important",
                  }}
                /> */}
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "15px 0 0 0" }}
                  flexWrap="nowrap"
                >
                  {`${user?.first_name} ${user?.last_name}`}
                </Typography>
              </Box>
            </Box>
          )}
          <Box>
            {NavigationLinks.map((item) => (
              <Box key={item.title} className="menu-item-links" mx={2} py={1}>
                <Item
                  title={item.title}
                  to={item.to}
                  icon={item.icon}
                  // navLink={navLink}
                  // setNavLink={setNavLink}
                  currentPath={router.pathname}
                  collapsed={collapsed}
                />
              </Box>
            ))}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  ) : null;
};

export default MySideBar;
