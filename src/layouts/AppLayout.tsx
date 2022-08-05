import { Box, Container } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

const AppLayout = () => {
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
