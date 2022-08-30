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
import { useCallback } from "react";
import {
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { walletRef } from "../../firebase";
import { IWallet, setWallets } from "../../features/wallets/wallets-slice";

const validationSchema = yup.object().shape({
  name: yup.string().max(100).required(),
  balance: yup.number().min(0).required(),
});

const DialogCreateWallet = () => {
  const openDialog = useAppSelector((state) => state.dialog.openCreateWallet);
  const { uid } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      balance: "0",
    },
    validationSchema,
    onSubmit: function ({ name, balance }, formikHelpers) {
      setDoc(doc(walletRef), {
        uid,
        name: name,
        balance: +balance,
        default: true,
        createAt: serverTimestamp(),
        updateAt: serverTimestamp(),
      }).then(() => {
        if (uid) {
          getDocs(query(walletRef, where("uid", "==", uid))).then(
            (snapshot) => {
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
            }
          );
        }
        dispatch(toggleDialog("openCreateWallet"));
        formikHelpers.resetForm();
      });
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
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: "16px 24px" }}>
              <Button variant="outlined" onClick={handleOnClose}>
                ยกเลิก
              </Button>
              <Button variant="contained" type="submit">
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
