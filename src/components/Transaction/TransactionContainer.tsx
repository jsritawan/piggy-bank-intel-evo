import {
  Stack,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { getDocs, query, where, Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchCategories } from "../../features/category/category-slice";
import { toggleDialog } from "../../features/dialog/dialog-slice";
import { fetchTransaction } from "../../features/transactions/transactions-slice";
import { IWallet, setWallets } from "../../features/wallets/wallets-slice";
import { walletRef } from "../../firebase";
import { useMounted } from "../../hooks";
import AddTransactionContainer from "../AddTransaction/AddTransactionContainer";
import PeriodContainer from "../Period/PeriodContainer";
import { WalletContainer } from "../Wallet";
import TransactionHeader from "./TransactionHeader";
import TransactionList from "./TransactionList";

const TransactionContainer = () => {
  const mounted = useMounted();
  const { defaultWallet, wallets } = useAppSelector(
    (state) => state.walletState
  );
  const { uid, authenticated } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<IWallet>();
  const [isLoading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    if (date && defaultWallet?.id && uid) {
      const promise = dispatch(
        fetchTransaction({ date, uid, walletId: defaultWallet.id })
      );
      return () => {
        promise.abort();
      };
    }
  }, [date, defaultWallet?.id, dispatch, uid]);

  useEffect(() => {
    setDate(new Date());
  }, []);

  useEffect(() => {
    setSelectedWallet(wallets.find((w) => w.default));
  }, [wallets]);

  useEffect(() => {
    if (wallets.length === 0) {
      dispatch(toggleDialog("openCreateWallet"));
    }
  }, [wallets, dispatch]);

  useEffect(() => {
    if (authenticated && uid) {
      dispatch(fetchCategories(uid));

      getDocs(query(walletRef, where("uid", "==", uid))).then((snapshot) => {
        const wallets: IWallet[] = snapshot.docs.map((d) => {
          const { balance, name, createAt, updateAt } = d.data();
          return {
            id: d.id,
            uid,
            balance,
            name,
            default: d.data().default,
            createAt: createAt
              ? (createAt as Timestamp).toDate().toString()
              : "",
            updateAt: updateAt
              ? (updateAt as Timestamp).toDate().toString()
              : "",
          };
        });
        dispatch(setWallets(wallets));
        setLoading(false);
      });
    }
  }, [authenticated, dispatch, uid]);

  if (mounted.current || isLoading) {
    return <></>;
  }

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
                {date && <PeriodContainer date={date} setDate={setDate} />}
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
                {date && (
                  <AddTransactionContainer date={date} setOpen={setOpen} />
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default TransactionContainer;
