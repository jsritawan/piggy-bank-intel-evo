import {
  Stack,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { toggleDialog } from "../../features/dialog/dialog-slice";
import { transactionRef, walletRef } from "../../firebase";
import AddTransactionContainer from "../AddTransaction/AddTransactionContainer";
import DialogCreateWallet from "../Dialog/DialogCreateWallet";
import PeriodContainer from "../Period/PeriodContainer";
import { WalletContainer } from "../Wallet";
import TransactionHeader from "./TransactionHeader";
import TransactionList from "./TransactionList";

const TransactionContainer = () => {
  const { selectedWallet, wallets } = useAppSelector(
    (state) => state.walletState
  );
  const { uid, isLoggedIn } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (wallets.length === 0) {
      dispatch(toggleDialog("openCreateWallet"));
    }
  }, [wallets, dispatch]);

  useEffect(() => {
    // query(walletRef, wh)

    if (isLoggedIn) {
      console.log(uid);

      getDocs(query(walletRef, where("uid", "==", uid))).then((snapshot) => {
        console.log({ length: snapshot.docs.length });
      });
    }
  }, [isLoggedIn, uid]);

  return (
    <Box>
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

            <TransactionHeader />

            <TransactionList />

            <Dialog
              open={open}
              onClose={() => {
                setOpen(false);
              }}
            >
              <DialogTitle>เพิ่มธรุกรรม</DialogTitle>
              <DialogContent>
                <AddTransactionContainer setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </>
        )}
      </Stack>
      <DialogCreateWallet />
    </Box>
  );
};

export default TransactionContainer;
