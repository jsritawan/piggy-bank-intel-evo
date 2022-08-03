import {
  Archive,
  Edit,
  FileCopy,
  KeyboardArrowDown,
  MoreHoriz,
} from "@mui/icons-material";
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
  styled,
  Menu,
  MenuProps,
  alpha,
  Divider,
  MenuItem,
} from "@mui/material";
import React from "react";
import { useAppSelector } from "../../app/hooks";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const Header = () => {
  const { selectedWallet, wallets } = useAppSelector(
    (state) => state.walletState
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          component="a"
          href=""
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
            flexGrow: 0,
            letterSpacing: ".175rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          INTEL EVO - PIGGY BANK
        </Typography>
        {selectedWallet && (
          <>
            <Button
              id="list-wallet-button"
              aria-controls={open ? "list-wallet-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              variant="outlined"
              color="inherit"
              disableElevation
              onClick={handleClick}
              endIcon={<KeyboardArrowDown />}
              sx={{ ml: 1 }}
            >
              Options
            </Button>
            <Menu
              id="list-wallet-menu"
              MenuListProps={{
                "aria-labelledby": "list-wallet-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 180,
                },
              }}
            >
              {wallets.map((w) => (
                <MenuItem
                  key={w.id}
                  sx={{ justifyContent: "space-between" }}
                  onClick={handleClose}
                  disableRipple
                >
                  <Typography>{w.name}</Typography>
                  <Typography>
                    {new Intl.NumberFormat("en-TH", {
                      style: "currency",
                      currency: "THB",
                    }).format(w.balance)}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
        <Container disableGutters>
          <Box sx={{ flexGrow: 1 }} />
        </Container>
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
