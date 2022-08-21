import { Settings, Logout } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Stack,
  Link as MuiLink,
  alpha,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { forwardRef, useState } from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { auth } from "../../firebase";

const Link = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>(({ href, children, ...rest }, ref) => {
  const theme = useTheme();
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <MuiLink
      ref={ref}
      to={href}
      {...rest}
      component={RouterLink}
      textTransform="uppercase"
      sx={{
        textDecoration: "none",
        py: 0.5,
        color: isActive ? "#fff" : alpha("#fff", 0.4),
        borderBottom: isActive ? "1px solid #fff" : "none",
        letterSpacing: 1,
        transition: `all ${theme.transitions.duration.shortest}ms ${theme.transitions.easing.easeInOut} `,
        ":hover": {
          color: "#fff",
        },
      }}
    >
      {children}
    </MuiLink>
  );
});

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

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
            letterSpacing: ".175rem",
            color: "inherit",
            textDecoration: "none",
            borderRight: "1px solid #fff",
            pr: 2,
          }}
        >
          INTEL EVO - PIGGY BANK
        </Typography>

        <Stack direction="row" spacing={3} flexGrow={1} ml={2}>
          <Link href="/">Transaction</Link>
          {/*
            <Link href="/settings">Settings</Link>
            <Link href="/dashboard">dashboard</Link>
            <Link href="/login">login</Link> 
          */}
        </Stack>
        <Box>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
            sx={{ p: 0 }}
          >
            <Avatar
              alt="User Image"
              src="/images/intel evo badge - unlevel.png"
            />
          </IconButton>
        </Box>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          PaperProps={{
            sx: {
              mt: 1,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/settings");
            }}
          >
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              signOut(auth).then(() => {
                setAnchorEl(null);
                // navigate("/login");
              });
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
