import { Box, Container } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Header from "../components/Header/Header";
import { fetchCategories } from "../features/category/category-slice";
import { fetchMasCatColors } from "../features/master/master-slice";

const AppLayout = () => {
  const { isLoggedIn, uid } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMasCatColors());
    if (uid) {
      dispatch(fetchCategories(uid));
    }
  }, [dispatch, uid]);

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
