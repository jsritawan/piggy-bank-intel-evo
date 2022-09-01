import { DeleteRounded, WarningAmberRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { grey, red } from "@mui/material/colors";
import {
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { chunk, cloneDeep } from "lodash";
import { FormEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setDialog } from "../../features/dialog/dialog-slice";
import { IWallet, setWallets } from "../../features/wallets/wallets-slice";
import { db, transactionRef, walletRef } from "../../firebase";

const SettingWallet = () => {
  const theme = useTheme();
  const wallets = useAppSelector((state) => state.walletState.wallets);
  const { uid } = useAppSelector((state) => state.auth.user);

  const dispatch = useAppDispatch();

  const [selectedWallet, setSelectedWallet] = useState<IWallet | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [mouseOverItemId, setMouseOverItemId] = useState<string>();
  const [disabled, setDisabled] = useState(false);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedWallet || !uid) {
      return;
    }

    try {
      setDisabled(true);

      const { id, name } = selectedWallet;
      await updateDoc(doc(walletRef, id), {
        name,
        updateAt: serverTimestamp(),
      });
      setOpenDialog(false);
      setSelectedWallet(null);
      fetchWallets(uid);
    } finally {
      setDisabled(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWallet(null);
  };

  const onClickDelete =
    (wallet: IWallet) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setOpenConfirmDialog(true);
      setSelectedWallet(wallet);
    };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedWallet || !uid) {
        return;
      }
      setDisabled(true);

      const txnSnapshot = await getDocs(
        query(
          transactionRef,
          where("uid", "==", uid),
          where("walletId", "==", selectedWallet.id)
        )
      );

      const MAX_TRANSACTION_WRITES = 500;
      const batchPool = chunk(txnSnapshot.docs, MAX_TRANSACTION_WRITES).map(
        (txnDocs) => {
          const wb = writeBatch(db);
          for (let txnDoc of txnDocs) {
            wb.delete(doc(transactionRef, txnDoc.id));
          }
          return wb.commit();
        }
      );
      const batch = writeBatch(db);
      if (selectedWallet.isDefault && wallets.length >= 2) {
        const firstWallet = wallets.filter(
          (w) => w.id !== selectedWallet.id
        )[0];
        batch.update(doc(walletRef, firstWallet.id), {
          isDefault: true,
          updateAt: serverTimestamp(),
        });
      }
      batch.delete(doc(walletRef, selectedWallet.id));
      batchPool.push(batch.commit());

      await Promise.all(batchPool);
      setOpenConfirmDialog(false);
      setSelectedWallet(null);

      fetchWallets(uid);
    } finally {
      setDisabled(false);
    }
  };

  const handleConfirmDialogClose = () => {
    setOpenConfirmDialog(false);
    setSelectedWallet(null);
  };

  const fetchWallets = useCallback(
    async (uid: string) => {
      const snapshot = await getDocs(query(walletRef, where("uid", "==", uid)));
      const wallets: IWallet[] = snapshot.docs.map((d) => {
        const { balance, name, createAt, updateAt, isDefault } = d.data();
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
      dispatch(setWallets(wallets));
    },
    [dispatch]
  );

  useEffect(() => {
    if (uid) {
      fetchWallets(uid);
    }
  }, [dispatch, fetchWallets, uid]);

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>
          กระเป๋าสตางค์ทั้งหมด
          <Typography
            component="span"
            fontSize="12px"
            ml={1}
            sx={{ color: wallets.length === 6 ? red : grey[600] }}
          >
            ({wallets.length}/6)
          </Typography>
        </Typography>

        {wallets.length < 6 && (
          <Button
            variant="contained"
            onClick={() =>
              dispatch(setDialog({ name: "openCreateWallet", open: true }))
            }
          >
            เพิ่มกระเป๋าสตางค์
          </Button>
        )}
      </Box>
      <Divider sx={{ my: 2 }} />
      <List
        disablePadding
        sx={{
          width: "100%",
        }}
      >
        {wallets.map((wallet) => (
          <ListItemButton
            key={wallet.id}
            onClick={() => {
              setSelectedWallet(cloneDeep(wallet));
              setOpenDialog(true);
            }}
            sx={{
              borderRadius: 1,
              minHeight: "56px",
            }}
            onMouseEnter={() => setMouseOverItemId(wallet.id)}
            onMouseLeave={() => setMouseOverItemId(undefined)}
            disabled={disabled}
          >
            <ListItemText secondary={wallet.balance}>
              {wallet.name}
              {wallet.isDefault && (
                <Chip
                  label="default"
                  variant="outlined"
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </ListItemText>
            <ListItemAvatar
              sx={{
                display: "flex",
                justifyContent: "end",
                width: theme.spacing(3),
              }}
            >
              {wallet.id === mouseOverItemId && (
                <IconButton onClick={onClickDelete(wallet)} disabled={disabled}>
                  <DeleteRounded color="error" />
                </IconButton>
              )}
            </ListItemAvatar>
          </ListItemButton>
        ))}
      </List>

      {openDialog && (
        <Dialog open onClose={handleCloseDialog}>
          <form onSubmit={handleOnSubmit}>
            <DialogTitle>แก้ไขชื่อประเป๋าสตางค์</DialogTitle>
            <DialogContent>
              {selectedWallet && (
                <TextField
                  inputProps={{ maxLength: 100 }}
                  value={selectedWallet.name}
                  onChange={(e) => {
                    const newWallet = cloneDeep(selectedWallet);
                    newWallet.name = e.target.value;
                    setSelectedWallet(newWallet);
                  }}
                  required
                  disabled={disabled}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} disabled={disabled}>
                ยกเลิก
              </Button>
              <Button variant="contained" type="submit" disabled={disabled}>
                ยืนยัน
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}

      {openConfirmDialog && (
        <Dialog open onClose={handleConfirmDialogClose}>
          <DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <WarningAmberRounded color="warning" />
              <Typography variant="h6">คำเตือน</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              คุณต้องการลบกระเป๋าสตางค์นี้หรือไม่?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleConfirmDialogClose}
              variant="contained"
              disabled={disabled}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              disabled={disabled}
            >
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default SettingWallet;
