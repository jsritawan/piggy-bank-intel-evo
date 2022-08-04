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
import { addWallet } from "../../features/wallets/wallets-slice";
import * as yup from "yup";
import { useFormik } from "formik";
import { useCallback } from "react";

const validationSchema = yup.object().shape({
  name: yup.string().max(100).required(),
  balance: yup.number().min(0).required(),
});

const DialogCreateWallet = () => {
  const openDialog = useAppSelector((state) => state.dialog.openCreateWallet);
  const dispatch = useAppDispatch();

  const userId = "userId";

  const formik = useFormik({
    initialValues: {
      name: "",
      balance: "0",
    },
    validationSchema,
    onSubmit({ name, balance }, formikHelpers) {
      dispatch(
        addWallet({
          id: new Date().toString(),
          userId,
          name: name,
          balance: +balance,
          createAt: new Date().toString(),
        })
      );
      dispatch(toggleDialog("openCreateWallet"));
      formikHelpers.resetForm();
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
