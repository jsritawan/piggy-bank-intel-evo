import React, { useCallback, useState } from "react";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import * as yup from "yup";
import { auth, signInWithGoogle } from "../firebase";
import { FirebaseError } from "firebase/app";

const Login = () => {
  const [isLoading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleOnSubmit = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        if (error instanceof FirebaseError) {
          setErrorMessage(error.message);
          setOpenSnackbar(true);
          return;
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSignInWithGmail = useCallback(async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(error.message);
        setOpenSnackbar(true);
        return;
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOnSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const { errors, touched, handleSubmit, getFieldProps } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    }),
    onSubmit({ email, password }) {
      handleOnSubmit(email, password);
    },
  });

  return (
    <React.Fragment>
      <Box
        display="flex"
        height={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 1,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.04)",
            minWidth: "375px",
            overflow: "clip",
            position: "relative",
          }}
        >
          {isLoading && (
            <LinearProgress
              sx={{ position: "absolute", top: "0px", width: "100%" }}
            />
          )}
          <Box sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  {...getFieldProps("email")}
                  label="email"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  {...getFieldProps("password")}
                  label="password"
                  type="password"
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </Stack>
              <Stack spacing={2} mt={5}>
                <Button variant="contained" type="submit">
                  sign in
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleSignInWithGmail}
                >
                  sign in with gmail
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={handleOnSnackbarClose}
        autoHideDuration={6000}
      >
        <Alert severity="error" onClose={handleOnSnackbarClose}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Login;
