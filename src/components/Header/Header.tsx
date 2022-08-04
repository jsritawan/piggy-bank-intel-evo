import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";

const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 0,
            mr: 3,
          }}
        >
          <Box
            component="img"
            src="/images/evo i7i9i5-family-badges-centered.png"
            width="100px"
          />
        </Box>
        <Typography
          noWrap
          sx={{
            flexGrow: 1,
            letterSpacing: ".175rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          INTEL EVO - PIGGY BANK
        </Typography>
        <Box>
          <IconButton sx={{ p: 0 }}>
            <Avatar
              alt="User Image"
              src="/images/intel evo badge - unlevel.png"
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
