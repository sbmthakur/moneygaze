import {
  Avatar,
  Box,
  Container,
  Stack,
  IconButton,
  InputAdornment,
  Typography,
  Alert,
} from "@mui/material";
import { Button, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/";

import { GoogleLogin } from "@react-oauth/google";

const customStyles = (theme, colors) => ({
  inpuText: {
    "& label.Mui-focused": {
      color: `${theme.palette.neutral.light}`,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: `${theme.palette.neutral.light}`,
    },
  },

  errorText: {
    "& label.Mui-focused": {
      color: "red",
    },

    "& .MuiFilledInput-underline:after": {
      borderBottomColor: "red",
    },
  },

  signupButton: {
    borderRadius: "28px !important",
    paddingLeft: "30px !important",
    paddingRight: "30px !important",
    fontSize: "18px !important",
    backgroundColor: `${theme.palette.secondary.main} !important`,
  },
});

export const LoginForm = (props) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const theme = useTheme();
  const styles = customStyles(theme);
  //   const classes = useStyles();
  //   const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    setShowPassword(false);
    setEmailError(false);
    setPasswordError(false);
  }, []);

  const isInputError = () => {
    let errorFlag = false;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    setEmailError(false);
    setPasswordError(false);

    if (email === "") {
      errorFlag = true;
      setEmailError(true);
    } else if (
      (email.match(/@/g) || []).length !== 1 ||
      (email.match(/\./g) || []).length < 1
    ) {
      errorFlag = true;
      setEmailError(true);
    } else if (
      email.indexOf(".") === 0 ||
      email.indexOf("@") === 0 ||
      email.indexOf("-") === 0 ||
      email.indexOf("_") === 0
    ) {
      errorFlag = true;
      setEmailError(true);
    } else if (/[^a-zA-Z0-9.@_-]/.test(email)) {
      errorFlag = true;
      setEmailError(true);
    }

    if (password === "") {
      errorFlag = true;
      setPasswordError(true);
    } else if (
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      errorFlag = true;
      setPasswordError(true);
    }
    return errorFlag;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const isError = isInputError();

    if (!isError) {
      const userData = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      setEmailError(false);
      setPasswordError(false);

      props.onLoginSubmit(userData);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Avatar
        alt="R"
        src="/images/finance-1.png"
        sx={{ width: 80, height: 80 }}
      />
      <h1>Login</h1>

      {props.invalidError && (
        <Alert severity="error">Please enter valid credentials!</Alert>
      )}
      {props.userNotFound && (
        <Alert severity="error">User not found. Please signup first!</Alert>
      )}
      {props.responseError && (
        <Alert severity="error">There was some error. Try again!</Alert>
      )}

      <Container maxWidth="sm">
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={submitHandler}
          mt={2}
          px={6}
        >
          <Stack justifyContent="center" alignItems="center" spacing={2}>
            <TextField
              sx={emailError ? styles.errorText : styles.inpuText}
              required
              id="outlined-required3"
              label="Email Id"
              fullWidth
              variant="filled"
              inputProps={{
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                },
              }}
              error={emailError}
              helperText={emailError && "Incorrect Entry."}
              inputRef={emailRef}
            />
            <TextField
              sx={emailError ? styles.errorText : styles.inpuText}
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              label="Password *"
              variant="filled"
              fullWidth
              InputProps={{
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={passwordError}
              helperText={passwordError && "Must Contain (a-z, A-z, 0-9)"}
              inputRef={passwordRef}
            />
          </Stack>
          <Box
            mt={6}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button type="submit" variant="contained" sx={styles.signupButton}>
              Submit
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
            // flexBasis: "100px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "400",
            }}
            variant="h4"
          >
            Or
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            // flexBasis: "100px",
          }}
        >
          <GoogleLogin
            shape="pill"
            ux_mode="popup"
            onSuccess={(credentialResponse) => {
              props.onGoogleLoginSubmit(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </Box>
      </Container>
      <Stack direction="row" spacing={1} mt={5}>
        <Typography variant="h6" sx={{ fontWeight: "regular" }}>
          Don't have an account?
        </Typography>
        <Typography
          onClick={() => router.push("/signup")}
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: theme.palette.secondary.main,
            cursor: "pointer",
          }}
        >
          Signup
        </Typography>
      </Stack>
    </Box>
  );
};
