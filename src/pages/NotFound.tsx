import { Box, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      flexDirection={"column"}
      justifyContent={"center"}
    >
      <Typography variant="h2" textAlign={"center"}>
        404 | Page not found.
      </Typography>
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

export default NotFound;
