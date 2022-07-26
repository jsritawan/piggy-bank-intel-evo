import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";

const Header = () => {
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
          <Box sx={{ flexGrow: 1 }} />
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
};

export default Header;
