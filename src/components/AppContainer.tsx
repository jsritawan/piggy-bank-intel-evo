import React, { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import AddTransactionContainer from "./AddTransaction/AddTransactionContainer";
import PeriodContainer from "./Period/PeriodContainer";
import { WalletContainer } from "./Wallet";
import { toggleDialog } from "../features/dialog/dialog-slice";
import DialogCreateWallet from "./Dialog/DialogCreateWallet";

const AppContainer = () => {
  const { selectedWallet, wallets } = useAppSelector(
    (state) => state.walletState
  );
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (wallets.length === 0) {
      dispatch(toggleDialog("openCreateWallet"));
    }
  }, [wallets, dispatch]);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Stack>
        {wallets.length === 0 && (
          <Stack spacing={2}>
            <Typography variant="h5" textAlign={"center"}>
              ยังไม่มีกระเป๋าสตางค์ในระบบ?
            </Typography>
            <Typography variant="h5" textAlign={"center"}>
              ลองสร้างสักหนึ่งใบเพื่อใช้งานระบบสิ!
            </Typography>
            <Box textAlign={"center"}>
              <Button
                variant="contained"
                onClick={() => dispatch(toggleDialog("openCreateWallet"))}
              >
                เพิ่มกระเป๋าสตางค์
              </Button>
            </Box>
          </Stack>
        )}

        {wallets.length > 0 && <WalletContainer />}

        {selectedWallet && (
          <>
            <Stack spacing={2} mt={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <PeriodContainer />
                <Button variant="contained" onClick={() => setOpen(!open)}>
                  เพิ่มธรุกรรม
                </Button>
              </Box>
            </Stack>
            <Dialog
              open={open}
              onClose={() => {
                setOpen(false);
              }}
            >
              <DialogContent>
                <AddTransactionContainer setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </>
        )}
      </Stack>
      <DialogCreateWallet />
    </Container>
  );
};

export default AppContainer;
