import { Box, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <Box
      display="flex"
      height={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      <Typography variant="h4">Login Page.</Typography>
      <Box textAlign={"center"} mt={2}>
        <Typography
          variant="body1"
          component={Link}
          to="/"
          sx={{ color: "inherit" }}
        >
          goto homepage
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
