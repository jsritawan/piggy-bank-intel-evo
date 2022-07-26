import {
  Stack,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  doc,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchCategories } from "../../features/category/category-slice";
import { setDialog } from "../../features/dialog/dialog-slice";
import { fetchTransaction } from "../../features/transactions/transactions-slice";
import {
  IWallet,
  setDefaultWallet,
  setWallets,
} from "../../features/wallets/wallets-slice";
import { walletRef } from "../../firebase";
import AddTransactionContainer from "../AddTransaction/AddTransactionContainer";
import PeriodContainer from "../Period/PeriodContainer";
import { WalletContainer } from "../Wallet";
import TransactionHeader from "./TransactionHeader";
import TransactionList from "./TransactionList";

const TransactionContainer = () => {
  const { defaultWallet, wallets } = useAppSelector(
    (state) => state.walletState
  );
  const { uid } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<IWallet>();
  const [date, setDate] = useState<Date | null>(null);

  const convertWallet = useCallback(
    (docs: QueryDocumentSnapshot<DocumentData>[]) => {
      let foundDefault: boolean = false;
      const wallets: IWallet[] = docs.map((d) => {
        const { balance, name, createAt, updateAt, isDefault, uid } = d.data();
        if (!foundDefault) {
          foundDefault = Boolean(isDefault);
        }
        return {
          id: d.id,
          uid,
          balance,
          name,
          isDefault: isDefault,
          createAt: createAt ? (createAt as Timestamp).toDate().toString() : "",
          updateAt: updateAt ? (updateAt as Timestamp).toDate().toString() : "",
        };
      });
      return {
        wallets,
        found: foundDefault,
      };
    },
    []
  );

  const fetchWallets = useCallback(async () => {
    if (!uid) {
      return;
    }
    const snapshot = await getDocs(query(walletRef, where("uid", "==", uid)));
    const { found, wallets } = convertWallet(snapshot.docs);

    if (found) {
      dispatch(setWallets(wallets));
    }

    if (!found && wallets.length >= 1) {
      const wallet = wallets[0];
      dispatch(setDefaultWallet(wallet));
      await updateDoc(doc(walletRef, wallet.id), {
        isDefault: true,
        updateAt: serverTimestamp(),
      });

      // repeat to get all updated wallet
      const snapshot = await getDocs(query(walletRef, where("uid", "==", uid)));
      const { wallets: newWallets } = convertWallet(snapshot.docs);
      dispatch(setWallets(newWallets));
    }
  }, [convertWallet, dispatch, uid]);

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
    if (defaultWallet?.id) {
      setDate(new Date());
    }
  }, [defaultWallet?.id]);

  useEffect(() => {
    setDate(new Date());
  }, []);

  useEffect(() => {
    setSelectedWallet(wallets.find((w) => w.isDefault));
  }, [wallets]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  useEffect(() => {
    if (uid) {
      const promise = dispatch(fetchCategories(uid));
      return () => {
        promise.abort();
      };
    }
  }, [dispatch, uid]);

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
                onClick={() =>
                  dispatch(setDialog({ name: "openCreateWallet", open: true }))
                }
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
