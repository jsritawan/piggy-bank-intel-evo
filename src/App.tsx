import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Container } from "@mui/system";

function App() {
  return (
    <AppBar position="static">
      <Container disableGutters>
        <Toolbar>
          <Box
            component="img"
            src="/images/evo i7i9i5-family-badges-centered.png"
            width="100px"
            sx={{ flexGrow: 0, mr: 3 }}
          />
          <Typography
            component="a"
            href=""
            noWrap
            sx={{
              flexGrow: 0,
              letterSpacing: ".175rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            INTEL EVO - PIGGY BANK
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton sx={{ p: 0 }}>
              <Avatar
                alt="User Image"
                src="/images/intel evo badge - unlevel.png"
              />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default App;
