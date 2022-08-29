import { DeleteRounded, WarningAmberRounded } from "@mui/icons-material";
import {
  Box,
  Button,
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
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { cloneDeep } from "lodash";
import { FormEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleDialog } from "../../features/dialog/dialog-slice";
import { IWallet, setWallet } from "../../features/wallets/wallets-slice";
import { walletRef } from "../../firebase";

const SettingWallet = () => {
  const theme = useTheme();
  const wallets = useAppSelector((state) => state.walletState.wallets);
  const { uid } = useAppSelector((state) => state.auth.user);

  const dispatch = useAppDispatch();

  const [selectedWallet, setSelectedWallet] = useState<IWallet | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [mouseOverItemId, setMouseOverItemId] = useState<string>();

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedWallet) {
      const { id, name } = selectedWallet;
      updateDoc(doc(walletRef, id), {
        name,
        updateAt: serverTimestamp(),
      }).then(() => {
        setOpenDialog(false);
        setSelectedWallet(null);
        if (uid) {
          fetchWallets(uid);
        }
      });
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

  const handleConfirmDelete = () => {
    if (selectedWallet) {
      deleteDoc(doc(walletRef, selectedWallet.id)).then(() => {
        setOpenConfirmDialog(false);
        setSelectedWallet(null);
        if (uid) {
          fetchWallets(uid);
        }
      });
    }
  };

  const handleConfirmDialogClose = () => {
    setOpenConfirmDialog(false);
    setSelectedWallet(null);
  };

  const fetchWallets = useCallback(
    (uid: string) => {
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
        dispatch(setWallet(wallets));
      });
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
            onClick={() => dispatch(toggleDialog("openCreateWallet"))}
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
          >
            <ListItemText secondary={wallet.balance}>
              {wallet.name}
            </ListItemText>
            <ListItemAvatar
              sx={{
                display: "flex",
                justifyContent: "end",
                width: theme.spacing(3),
              }}
            >
              {wallet.id === mouseOverItemId && (
                <IconButton onClick={onClickDelete(wallet)}>
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
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>ยกเลิก</Button>
              <Button variant="contained" type="submit">
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
            <Button onClick={handleConfirmDialogClose} variant="contained">
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default SettingWallet;
