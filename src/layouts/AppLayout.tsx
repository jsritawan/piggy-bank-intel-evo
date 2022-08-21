import { Box, Container } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Header from "../components/Header/Header";
import { updateUserAuth } from "../features/auth/auth-slice";
import { auth } from "../firebase";

const AppLayout = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log({ user });

      if (!user) {
        dispatch(
          updateUserAuth({
            isLoggedIn: false,
          })
        );
        navigate("/login");
      } else {
        dispatch(
          updateUserAuth({
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            isLoggedIn: true,
          })
        );
      }
    });
  }, [dispatch, navigate]);
  console.log({ isLoggedIn });

  if (!isLoggedIn) {
    return <React.Fragment></React.Fragment>;
  }
  return (
    <Box>
      <Header />
      <Container maxWidth="md" sx={{ mt: "40px" }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default AppLayout;
