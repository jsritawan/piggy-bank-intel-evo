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
  Typography,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { chunk, isEmpty } from "lodash";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCategories,
  ICategory,
} from "../../features/category/category-slice";
import { ITransaction } from "../../features/transactions/transactions-slice";
import { IWallet, setWallets } from "../../features/wallets/wallets-slice";
import { categoryRef, db, transactionRef, walletRef } from "../../firebase";
import SettingCategoryCreateForm from "./SettingCategoryCreateForm";
import SettingCategoryEditDialog from "./SettingCategoryEditDialog";

const SettingCategoryList: React.FC<{
  categories: ICategory[];
  type: number;
  disabled?: boolean;
  openDialog: (cat: ICategory) => void;
  onDelete: (docId: string, type: number) => void;
}> = ({ categories, type, disabled, openDialog, onDelete }) => {
  const theme = useTheme();

  const { uid, authenticated } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [mouseOverItemId, setMouseOverItemId] = useState<string>();

  const filteredCategories = useMemo(
    () => categories?.filter((cat) => cat.type === type),
    [categories, type]
  );

  const onClickDelete = useCallback(
    (catId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDelete(catId, type);
    },
    [onDelete, type]
  );

  useEffect(() => {
    if (authenticated && uid) {
      dispatch(fetchCategories(uid));
    }
  }, [authenticated, dispatch, uid]);

  return (
    <Box>
      <Typography>
        {type === 1 ? "รายรับ" : "รายจ่าย"}
        <Typography
          component="span"
          fontSize="12px"
          ml={1}
          sx={{ color: grey[600] }}
        >
          ({filteredCategories.length})
        </Typography>
      </Typography>
      <Divider sx={{ my: 2 }} />
      <List
        disablePadding
        sx={{
          width: "100%",
        }}
      >
        {filteredCategories.map((cat) => (
          <ListItemButton
            key={cat.id}
            onClick={() => openDialog(cat)}
            sx={{
              borderRadius: 1,
              minHeight: "56px",
            }}
            onMouseEnter={() => setMouseOverItemId(cat.id)}
            onMouseLeave={() => setMouseOverItemId(undefined)}
            disabled={disabled}
          >
            <ListItemAvatar>
              <Box
                sx={{
                  bgcolor: cat.color,
                  width: theme.spacing(3),
                  height: theme.spacing(3),
                  borderRadius: "100%",
                }}
              />
            </ListItemAvatar>
            <ListItemText>{cat.name}</ListItemText>
            <ListItemAvatar
              sx={{
                display: "flex",
                justifyContent: "end",
                width: theme.spacing(3),
              }}
            >
              {cat.isDeletable && cat.id === mouseOverItemId && (
                <IconButton onClick={onClickDelete(cat.id)} disabled={disabled}>
                  <DeleteRounded color="error" />
                </IconButton>
              )}
            </ListItemAvatar>
          </ListItemButton>
        ))}
        {isEmpty(filteredCategories) && (
          <ListItemText sx={{ textAlign: "center" }}>ไม่พบข้อมูล</ListItemText>
        )}
      </List>
    </Box>
  );
};

const SettingCategory = () => {
  const dispatch = useAppDispatch();
  const { uid } = useAppSelector((state) => state.auth.user);
  const categories = useAppSelector((state) => state.categories.categories);
  const wallets = useAppSelector((state) => state.walletState.wallets);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPreventDeleteDialog, setOpenPreventDeleteDialog] = useState(false);
  const [category, setCategory] = useState<ICategory>();
  const [deleteCategoryId, setDeleteCategoryId] = useState<string>();
  const [isLoading, setLoading] = useState(false);

  const handleEditDialogOpen = (category: ICategory) => {
    setCategory(category);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setCategory(undefined);
    setOpenEditDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      // remove category and transactions
      if (!uid) {
        return;
      }

      setLoading(true);

      const txnSnapshot = await getDocs(
        query(
          transactionRef,
          where("uid", "==", uid),
          where("categoryId", "==", deleteCategoryId)
        )
      );

      const MAX_TRANSACTION_WRITES = 500;
      const updateWalletMap: Map<string, number> = new Map();
      const batchPool = chunk(txnSnapshot.docs, MAX_TRANSACTION_WRITES).map(
        (txnDocs) => {
          const wb = writeBatch(db);
          for (let txnDoc of txnDocs) {
            wb.delete(doc(transactionRef, txnDoc.id));
            const txn: ITransaction = txnDoc.data() as any;
            let amount: number = txn.amount;
            if (txn.type === 1) {
              amount *= -1;
            }
            const oldAmount = updateWalletMap.get(txn.walletId) ?? 0;
            updateWalletMap.set(txn.walletId, oldAmount + amount);
          }
          return wb.commit();
        }
      );

      const updateWalletBatch = writeBatch(db);
      for (const { id, balance } of wallets) {
        const amount = updateWalletMap.get(id) ?? 0;
        updateWalletBatch.update(doc(walletRef, id), {
          balance: balance + amount,
          updateAt: serverTimestamp(),
        });
      }
      batchPool.push(updateWalletBatch.commit());

      const deleteCategoryBatch = writeBatch(db);
      deleteCategoryBatch.delete(doc(categoryRef, deleteCategoryId));
      batchPool.push(deleteCategoryBatch.commit());

      await Promise.all(batchPool);
      await dispatch(fetchCategories(uid));

      const walletSnapshot = await getDocs(
        query(walletRef, where("uid", "==", uid))
      );
      const newWallets: IWallet[] = walletSnapshot.docs.map((d) => {
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
      dispatch(setWallets(newWallets));

      setOpenConfirmDialog(false);
      setOpenEditDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDialogClose = () => {
    setOpenConfirmDialog(false);
    setDeleteCategoryId(undefined);
  };

  const onDelete = async (categoryId: string, type: number) => {
    try {
      setLoading(true);

      const filtered = categories.filter((c) => c.type === type);
      if (filtered.length < 2) {
        setOpenPreventDeleteDialog(true);
        return;
      }

      // check if not use then delete otherwise open confirm dialog.
      const snapshot = await getDocs(
        query(
          transactionRef,
          where("uid", "==", uid),
          where("categoryId", "==", categoryId),
          limit(1)
        )
      );

      if (!isEmpty(snapshot.docs)) {
        setOpenConfirmDialog(true);
        setDeleteCategoryId(categoryId);
        return;
      }

      // delete category
      await deleteDoc(doc(categoryRef, categoryId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack spacing="16px" sx={{ width: "100%" }}>
        <SettingCategoryCreateForm />

        <SettingCategoryList
          categories={categories}
          type={1}
          openDialog={handleEditDialogOpen}
          onDelete={onDelete}
          disabled={isLoading}
        />
        <SettingCategoryList
          categories={categories}
          type={2}
          openDialog={handleEditDialogOpen}
          onDelete={onDelete}
          disabled={isLoading}
        />
      </Stack>

      {openEditDialog && category && (
        <SettingCategoryEditDialog
          openConfirm={setOpenConfirmDialog}
          category={category}
          onClose={handleEditDialogClose}
        />
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
              คุณต้องการลบหมวดหมู่นี้หรือไม่?
            </DialogContentText>
            <DialogContentText>
              หากคุณยืนยัน
              ธุรกรรมทั้งหมดที่ใช้หมวดหมู่นี้ในกระเป๋าทุกใบจะถูกลบไปด้วย
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleConfirmDialogClose}
              variant="contained"
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              disabled={isLoading}
            >
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {openPreventDeleteDialog && (
        <Dialog open onClose={() => setOpenPreventDeleteDialog(false)}>
          <DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <WarningAmberRounded color="warning" />
              <Typography variant="h6">คำเตือน</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>ไม่สามารถลบหมวดหมู่นี้ได้</DialogContentText>
            <DialogContentText>
              ระบบต้องการหมวดหมู่ในแต่ละชนิดของธุรกรรม อย่างน้อย 1 หมวดหมู่
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenPreventDeleteDialog(false)}
              variant="contained"
            >
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default SettingCategory;
