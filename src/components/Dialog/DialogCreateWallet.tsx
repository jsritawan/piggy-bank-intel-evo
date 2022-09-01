import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleDialog } from "../../features/dialog/dialog-slice";
import * as yup from "yup";
import { useFormik } from "formik";
import { useCallback, useState } from "react";
import {
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { db, walletRef } from "../../firebase";
import { IWallet, setWallets } from "../../features/wallets/wallets-slice";

const validationSchema = yup.object().shape({
  name: yup.string().max(100).required(),
  balance: yup.number().min(0).required(),
});

const DialogCreateWallet = () => {
  const dispatch = useAppDispatch();
  const openDialog = useAppSelector((state) => state.dialog.openCreateWallet);
  const { uid } = useAppSelector((state) => state.auth.user);
  const wallets = useAppSelector((state) => state.walletState.wallets);
  const [isLoading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      balance: "0",
    },
    validationSchema,
    onSubmit: async function ({ name, balance }, formikHelpers) {
      try {
        setLoading(true);

        const batch = writeBatch(db);
        batch.set(doc(walletRef), {
          uid,
          name: name,
          balance: +balance,
          isDefault: true,
          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        });

        wallets
          .filter((w) => w.isDefault)
          .forEach((w) => {
            batch.update(doc(walletRef, w.id), {
              isDefault: false,
              updateAt: serverTimestamp(),
            });
          });

        await batch.commit();

        if (uid) {
          const walletSnapshot = await getDocs(
            query(walletRef, where("uid", "==", uid))
          );
          const wallets: IWallet[] = walletSnapshot.docs.map((d) => {
            const { balance, name, createAt, updateAt, isDefault } = d.data();
            return {
              id: d.id,
              uid,
              balance,
              name,
              isDefault: isDefault,
              createAt: createAt
                ? (createAt as Timestamp).toDate().toString()
                : "",
              updateAt: updateAt
                ? (updateAt as Timestamp).toDate().toString()
                : "",
            };
          });
          dispatch(setWallets(wallets));
        }
        dispatch(toggleDialog("openCreateWallet"));
        formikHelpers.resetForm();
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOnClose = useCallback(() => {
    dispatch(toggleDialog("openCreateWallet"));
    formik.resetForm();
  }, [formik, dispatch]);

  return (
    <>
      {openDialog && (
        <Dialog open={true} onClose={handleOnClose} maxWidth="sm" fullWidth>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>เพิ่มกระเป๋าสตางค์</DialogTitle>
            <DialogContent>
              <Stack
                spacing={1}
                sx={{
                  "label:not(:first-of-type)": {
                    mt: 2,
                  },
                }}
              >
                <Typography component="label">ชื่อกระเป๋าสตางค์</Typography>
                <TextField
                  {...formik.getFieldProps("name")}
                  placeholder="ชื่อกระเป๋าสตางค์"
                  error={formik.touched["name"] && !!formik.errors["name"]}
                  helperText={formik.touched["name"] && formik.errors["name"]}
                  disabled={isLoading}
                />

                <Typography component="label">จำนวนเงิน</Typography>
                <TextField
                  {...formik.getFieldProps("balance")}
                  placeholder="จำนวนเงิน"
                  error={
                    formik.touched["balance"] && !!formik.errors["balance"]
                  }
                  helperText={
                    formik.touched["balance"] && formik.errors["balance"]
                  }
                  onBlur={() =>
                    formik.setFieldValue(
                      "balance",
                      Number(formik.values.balance || "0").toFixed(2)
                    )
                  }
                  disabled={isLoading}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: "16px 24px" }}>
              <Button
                variant="outlined"
                onClick={handleOnClose}
                disabled={isLoading}
              >
                ยกเลิก
              </Button>
              <Button variant="contained" type="submit" disabled={isLoading}>
                บันทึก
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </>
  );
};

export default DialogCreateWallet;
