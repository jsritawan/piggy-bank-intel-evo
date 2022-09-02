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
import {
  Dispatch,
  FunctionComponent,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
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
  ITransaction,
  updateTransaction,
} from "../../features/transactions/transactions-slice";
import { isEmpty } from "lodash";
import { updateWalletBalance } from "../../features/wallets/wallets-slice";
import NumberFormat from "react-number-format";

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
  transaction?: ITransaction;
  disabled?: boolean;
}
const AddTransactionContainer: FunctionComponent<IProps> = ({
  setOpen,
  date,
  transaction,
  disabled,
}) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const { uid } = useAppSelector((state) => state.auth.user);
  const wallet = useAppSelector((state) => state.walletState.defaultWallet);
  const [txnType, setTxnType] = useState<number>(transaction?.type ?? 2);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [preventOnClose, setPreventOnClose] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const filteredCategories = useMemo(
    () => categories.filter((cat) => cat.type === txnType),
    [categories, txnType]
  );

  const calculateChange = (params: {
    oldType: number;
    newType: number;
    oldAmount: number;
    newAmount: number;
    balance: number;
  }): number => {
    const { oldAmount, newAmount, oldType, newType, balance } = params;

    if (oldAmount === newAmount && oldType === newType) {
      return balance;
    }

    const INCOME = 1;
    const EXPENSE = 2;

    // same type
    if (newType === oldType) {
      if (newType === INCOME) {
        return balance - oldAmount + newAmount;
      }
      return balance + oldAmount - newAmount;
    }
    // ex -> inc
    if (oldType === EXPENSE && newType === INCOME) {
      return balance + (newAmount - oldAmount + oldAmount * 2);
    }
    // inc -> ex
    if (oldType === INCOME && newType === EXPENSE) {
      return balance - (oldAmount - newAmount + newAmount * 2);
    }

    return 0;
  };

  const initialValues: TransactionForm = useMemo(() => {
    if (transaction) {
      return {
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        note: transaction.note ?? "",
        date: date,
        type: transaction.type,
      };
    }
    return {
      amount: 0,
      categoryId: "",
      note: "",
      date: new Date(),
      type: txnType,
    };
  }, [date, transaction, txnType]);

  const {
    errors,
    touched,
    getFieldProps,
    handleSubmit,
    setFieldValue,
    setTouched,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      try {
        if (isEmpty(uid) || uid === null || wallet === undefined) {
          return;
        }

        setLoading(true);

        let changed = 0;
        const { type, amount } = values;
        if (isEmpty(transaction)) {
          const createResult = await dispatch(
            createTransaction({
              ...values,
              uid,
              wallet,
            })
          );

          if (!createTransaction.fulfilled.match(createResult)) {
            return;
          }

          if (type === 1) {
            changed = wallet.balance + amount;
          } else {
            changed = wallet.balance - amount;
          }
        } else {
          changed = calculateChange({
            balance: wallet.balance,
            oldAmount: transaction.amount,
            newAmount: amount,
            oldType: transaction.type,
            newType: type,
          });

          const updateReusult = await dispatch(
            updateTransaction({
              ...values,
              wallet,
              changed,
              id: transaction.id,
            })
          );

          if (!updateTransaction.fulfilled.match(updateReusult)) {
            return;
          }
        }

        dispatch(updateWalletBalance(changed));
        await dispatch(fetchTransaction({ date, walletId: wallet.id, uid }));

        console.log({ values, changed });

        if (!preventOnClose) {
          setOpen(false);
          return;
        }

        const { date: prevDate } = values;
        formikHelpers.resetForm();
        formikHelpers.setFieldValue("date", prevDate);
      } finally {
        setLoading(false);
      }
    },
  });

  const onTypeChange = useCallback(
    (newType: number) => (_e: MouseEvent<HTMLButtonElement>) => {
      setTxnType(newType);
      setFieldValue("categoryId", "");
      setFieldValue("type", newType);
      setTouched({}, false);
    },
    [setFieldValue, setTouched]
  );

  useEffect(() => {
    if (transaction) {
      setTxnType(transaction.type);
    }
  }, [transaction]);

  return (
    <Box sx={{ borderRadius: 1, bgcolor: "#fff" }}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant={txnType === 2 ? "contained" : "outlined"}
              color="error"
              onClick={onTypeChange(2)}
              disabled={disabled && isLoading}
              fullWidth
            >
              รายจ่าย
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant={txnType === 1 ? "contained" : "outlined"}
              color="success"
              onClick={onTypeChange(1)}
              disabled={disabled && isLoading}
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
                disabled={disabled && isLoading}
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
              disabled={disabled && isLoading}
              select
              fullWidth
            >
              <MenuItem value="" disabled>
                เลือกประเภท
              </MenuItem>
              {filteredCategories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
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
                        bgcolor: c.color,
                        borderRadius: "100%",
                      }}
                    />
                    <Typography variant="body1" noWrap textOverflow="ellipsis">
                      {c.name}
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
              disabled={disabled && isLoading}
              error={touched["note"] && !!errors["note"]}
              helperText={touched["note"] && errors["note"]}
              fullWidth
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              จำนวนเงิน
            </Typography>
            <NumberFormat
              {...getFieldProps("amount")}
              customInput={TextField}
              decimalScale={2}
              onChange={undefined}
              onValueChange={({ floatValue }) => {
                setFieldValue("amount", floatValue);
              }}
              error={touched["amount"] && !!errors["amount"]}
              helperText={touched["amount"] && errors["amount"]}
              disabled={disabled && isLoading}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              label="เปิดป๊อปอัพไว้หลังเพิ่มธุรกรรม"
              control={
                <Checkbox
                  disabled={disabled && isLoading}
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
              disabled={disabled && isLoading}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ ml: 2 }}
              disabled={disabled && isLoading}
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
