import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import React, {
  Dispatch,
  FunctionComponent,
  MouseEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as yup from "yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { add, sub } from "date-fns";
import { th } from "date-fns/locale";
import {
  createTransaction,
  fetchTransaction,
} from "../../features/transactions/transactions-slice";
import { isEmpty } from "lodash";

const validationSchema = yup.object().shape({
  categoryId: yup.string().required("กรุณาเลือกหมวดหมู่"),
  note: yup.string(),
  amount: yup.number().required().positive().moreThan(0),
  type: yup.number().required(),
});

interface TransactionForm {
  amount: number;
  note: string;
  categoryId: string;
  date: Date;
  type: number;
}

interface IProps {
  date: Date;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const AddTransactionContainer: FunctionComponent<IProps> = ({
  setOpen,
  date,
}) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const { uid } = useAppSelector((state) => state.auth.user);
  const wallet = useAppSelector((state) => state.walletState.defaultWallet);
  const [txnType, setTxnType] = useState<number>(2);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [preventOnClose, setPreventOnClose] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const roundAmount = useCallback((num: number) => {
    return Number((Math.round(num * 100) / 100).toFixed(2));
  }, []);

  const initialValues: TransactionForm = {
    amount: 0,
    categoryId: "",
    note: "",
    date: new Date(),
    type: txnType,
  };

  const {
    errors,
    touched,
    values,
    getFieldProps,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      if (isEmpty(uid) || uid === null || wallet === undefined) {
        return;
      }

      setLoading(true);

      const createResult = await dispatch(
        createTransaction({ ...values, uid, wallet })
      );

      if (!createTransaction.fulfilled.match(createResult)) {
        return;
      }

      await dispatch(fetchTransaction({ date, walletId: wallet.id, uid }));

      setLoading(false);
      if (!preventOnClose) {
        setOpen(false);
        return;
      }

      const { date: prevDate } = values;
      formikHelpers.resetForm();
      formikHelpers.setFieldValue("date", prevDate);
    },
  });

  const onTypeChange = useCallback(
    (newType: number) => (_e: MouseEvent<HTMLButtonElement>) => {
      setTxnType(newType);
      setFieldValue("categoryId", "");
      setFieldValue("type", newType);
    },
    [setFieldValue]
  );

  return (
    <Box sx={{ borderRadius: 1, bgcolor: "#fff" }}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant={txnType === 2 ? "contained" : "text"}
              color="error"
              onClick={onTypeChange(2)}
              disabled={isLoading}
              fullWidth
            >
              รายจ่าย
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant={txnType === 1 ? "contained" : "text"}
              color="success"
              onClick={onTypeChange(1)}
              disabled={isLoading}
              fullWidth
            >
              รายรับ
            </Button>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              วันที่
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={th}
            >
              <DatePicker
                {...getFieldProps("date")}
                open={openCalendar}
                onOpen={() => setOpenCalendar(true)}
                onClose={() => setOpenCalendar(false)}
                onChange={(value) => {
                  setFieldValue("date", value);
                }}
                views={["year", "month", "day"]}
                inputFormat="dd/MM/yyyy"
                minDate={sub(new Date(), { years: 5 })}
                maxDate={add(new Date(), { years: 5 })}
                componentsProps={{
                  actionBar: {
                    actions: ["today"],
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onClick={() => setOpenCalendar(true)}
                    fullWidth
                  />
                )}
                disabled={isLoading}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              หมวดหมู่
            </Typography>
            <TextField
              {...getFieldProps("categoryId")}
              error={touched["categoryId"] && !!errors["categoryId"]}
              helperText={touched["categoryId"] && errors["categoryId"]}
              disabled={isLoading}
              select
              fullWidth
            >
              <MenuItem value="" disabled>
                เลือกประเภท
              </MenuItem>
              {categories
                .filter((cat) => cat.type === txnType)
                .map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <Stack
                      direction="row"
                      spacing={1}
                      width="100%"
                      overflow="hidden"
                    >
                      <Box
                        sx={{
                          height: "24px",
                          width: "24px",
                          flex: "0 0 24px",
                          bgcolor: cat.color,
                          borderRadius: "100%",
                        }}
                      />
                      <Typography
                        variant="body1"
                        noWrap
                        textOverflow="ellipsis"
                      >
                        {cat.name}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          <Grid item md={6} xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              รายละเอียด (optional)
            </Typography>
            <TextField
              {...getFieldProps("note")}
              disabled={isLoading}
              error={touched["note"] && !!errors["note"]}
              helperText={touched["note"] && errors["note"]}
              fullWidth
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              จำนวนเงิน
            </Typography>
            <TextField
              {...getFieldProps("amount")}
              error={touched["amount"] && !!errors["amount"]}
              helperText={touched["amount"] && errors["amount"]}
              onBlur={() =>
                setFieldValue("amount", roundAmount(values.amount || 0))
              }
              disabled={isLoading}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              label="เปิดป๊อปอัพไว้หลังเพิ่มธุรกรรม"
              control={
                <Checkbox
                  disabled={isLoading}
                  color="success"
                  onChange={(e) => setPreventOnClose(e.target.checked)}
                />
              }
            />
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Button
              variant="text"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ ml: 2 }}
              disabled={isLoading}
            >
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddTransactionContainer;
