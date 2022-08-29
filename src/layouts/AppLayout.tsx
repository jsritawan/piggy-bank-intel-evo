import { Box, Container } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import DialogCreateWallet from "../components/Dialog/DialogCreateWallet";
import Header from "../components/Header/Header";
import { fetchMasCatColors } from "../features/master/master-slice";

const AppLayout = () => {
  const { authenticated, uid } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMasCatColors());
  }, [dispatch, uid]);

  if (!authenticated) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <Box>
      <Header />
      <Container maxWidth="md" sx={{ mt: "40px" }}>
        <Outlet />
      </Container>
      <DialogCreateWallet />
    </Box>
  );
};

export default AppLayout;
