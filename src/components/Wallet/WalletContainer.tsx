import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  Fade,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
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
  };

  return (
    <Stack spacing={2}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Button
          variant="outlined"
          onClick={() => setListWallet(!listWallet)}
          endIcon={listWallet ? <ArrowDropUp /> : <ArrowDropDown />}
          sx={{
            textTransform: "none",
          }}
        >
          {selectedWallet?.name}
        </Button>

        {wallets.length < 6 && (
          <Button
            variant="contained"
            onClick={() => dispatch(toggleDialog("openCreateWallet"))}
          >
            เพิ่มกระเป๋าสตางค์
          </Button>
        )}
      </Stack>

      {listWallet && (
        <Box>
          <Grid container spacing={4}>
            {wallets.map((w) => (
              <Fade key={w.id} in>
                <Grid item md={4} xs={6}>
                  <ButtonBase
                    sx={{ p: 0, width: "100%" }}
                    onClick={() => handleSelectWallet(w.id)}
                  >
                    <Stack
                      sx={{
                        borderRadius: 1,
                        bgcolor: "#fff",
                        p: 2,
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <Typography variant="h5">{w.name}</Typography>
                      <Typography variant="caption" color="grey">
                        Balance
                      </Typography>
                      <Typography
                        variant="h4"
                        color={w.balance >= 0 ? "#4BBEEA" : "error"}
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
      )}
    </Stack>
  );
};

export default WalletContainer;
