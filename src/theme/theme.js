import { useColorStore } from "../store/colorStore";
import { createTheme } from "@mui/material";
import { tokens } from "./colorTokens";

export const useMuiTheme = () => {
  const mode = useColorStore((state) => state.colorMode);
  const colors = tokens(mode);

  return createTheme({
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.blueAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[300],
            },
            background: {
              default: colors.primary[500],
            },
            highlight: {
              text: colors.primary[500],
              background: colors.blueAccent[200],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.blueAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[300],
            },
            background: {
              default: "#FAFAFB",
            },

            highlight: {
              text: colors.primary[500],
              background: colors.blueAccent[900],
            },
          }),
    },
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    shadows: {
      1: "none",
      10: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
      24: "0px 0px 40px  rgba(0, 0, 0, 0.2)",
    },
    // breakpoints: {
    //   values: {
    //     xs: 0,
    //     sm: 450,
    //     md: 600,
    //     lg: 900,
    //     xl: 1200,
    //   },
    // },
  });
};
