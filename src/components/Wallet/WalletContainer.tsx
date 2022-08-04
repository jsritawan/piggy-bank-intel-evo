import {
  AccountBalanceWallet,
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  Fade,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleDialog } from "../../features/dialog/dialog-slice";
import { selectWallet } from "../../features/wallets/wallets-slice";

const WalletContainer = () => {
  const { selectedWallet, wallets } = useAppSelector(
    (state) => state.walletState
  );
  const dispatch = useAppDispatch();

  const [listWallet, setListWallet] = useState(false);

  const handleSelectWallet = (walletId: string) => {
    dispatch(selectWallet(walletId));

    setListWallet(false);
  };

  useEffect(() => {
    if (!selectedWallet && wallets.length > 0) {
      dispatch(selectWallet(wallets[0].id));
    }
  }, [selectedWallet, wallets, dispatch]);

  return (
    <Stack spacing={2}>
      <Stack
        direction={"row"}
        justifyContent={selectedWallet ? "space-between" : "end"}
        alignItems={"center"}
      >
        {selectedWallet && (
          <Button
            variant="text"
            onClick={() => setListWallet(!listWallet)}
            sx={{
              textTransform: "none",
              maxWidth: "260px",
              bgcolor: "#fff",
            }}
          >
            <AccountBalanceWallet
              sx={{
                color: "gray",
              }}
            />

            <Typography variant="body1" textOverflow={"ellipsis"} noWrap mx={1}>
              {selectedWallet.name}
            </Typography>

            {listWallet ? <ArrowDropUp /> : <ArrowDropDown />}
          </Button>
        )}

        {wallets.length < 6 && (
          <Button
            variant="contained"
            onClick={() => dispatch(toggleDialog("openCreateWallet"))}
          >
            เพิ่มกระเป๋าสตางค์
          </Button>
        )}
      </Stack>

      <Fade unmountOnExit in={listWallet}>
        <Box>
          <Grid container spacing={4}>
            {wallets.map((w) => (
              <Fade key={w.id} in>
                <Grid item md={4} xs={6}>
                  <ButtonBase
                    sx={{
                      p: 0,
                      width: "100%",
                      borderRadius: 1,
                      overflow: "clip",
                    }}
                    onClick={() => handleSelectWallet(w.id)}
                  >
                    <Stack
                      sx={{
                        bgcolor: "#fff",
                        p: 2,
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <Typography variant="h5" textOverflow={"ellipsis"} noWrap>
                        {w.name}
                      </Typography>
                      <Typography variant="caption" color="grey">
                        balance
                      </Typography>
                      <Typography
                        variant="h4"
                        color={w.balance >= 0 ? "#4BBEEA" : "error"}
                        textOverflow={"ellipsis"}
                        noWrap
                      >
                        {w.balance.toFixed(2)}
                      </Typography>
                    </Stack>
                  </ButtonBase>
                </Grid>
              </Fade>
            ))}
          </Grid>
        </Box>
      </Fade>
    </Stack>
  );
};

export default WalletContainer;
