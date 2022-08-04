import { ArrowDropDownRounded, ArrowDropUpRounded } from "@mui/icons-material";
import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Button,
  Menu,
  Typography,
  Grid,
  InputAdornment,
  Fade,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useCallback, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { Category, CategoryType } from "../../features/category/category-slice";
import * as yup from "yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { add, sub } from "date-fns";
import { th } from "date-fns/locale";

const validationSchema = yup.object().shape({
  category: yup.object().required(),
  note: yup.string(),
  labels: yup.array().of(yup.string()),
  amount: yup.number().required().positive().moreThan(0),
});

interface TransactionForm {
  id: string;
  amount: number;
  note?: string;
  category: Category;
  labels?: string[];
  date: Date;
}

const AddTransactionContainer: React.FC<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpen }) => {
  const categories = useAppSelector((state) => state.categories);
  const [txnType, setTxnType] = useState<CategoryType>(2);
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const [openCalendar, setOpenCalendar] = useState(false);
  const [preventOnClose, setPreventOnClose] = useState(false);

  const roundAmount = useCallback((num: number) => {
    return Number((Math.round(num * 100) / 100).toFixed(2));
  }, []);

  const initialValues: Partial<TransactionForm> = {
    amount: 0,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      if (!preventOnClose) {
        setOpen(false);
      }
    },
  });

  return (
    <Box sx={{ borderRadius: 1, bgcolor: "#fff", p: 2 }}>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              วันที่
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={th}
            >
              <DatePicker
                {...formik.getFieldProps("date")}
                open={openCalendar}
                onOpen={() => setOpenCalendar(true)}
                onClose={() => setOpenCalendar(false)}
                onChange={(value) => {
                  formik.setFieldValue("date", value);
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
                    error={formik.touched["date"] && !!formik.errors["date"]}
                    helperText={formik.touched["date"] && formik.errors["date"]}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              หมวดหมู่
            </Typography>
            <TextField
              {...formik.getFieldProps("category")}
              value={formik.values.category?.name || ""}
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
              }}
              InputProps={{
                readOnly: true,
                startAdornment: formik.values.category && (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        height: "16px",
                        width: "16px",
                        borderRadius: "100%",
                        bgcolor: formik.values.category.color,
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Fade key={+Boolean(anchorEl)} in>
                      {anchorEl ? (
                        <ArrowDropUpRounded />
                      ) : (
                        <ArrowDropDownRounded />
                      )}
                    </Fade>
                  </InputAdornment>
                ),
              }}
              error={formik.touched["category"] && !!formik.errors["category"]}
              helperText={
                formik.touched["category"] && formik.errors["category"]
              }
              fullWidth
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(undefined)}
              PaperProps={{
                sx: {
                  minWidth: "280px",
                  maxWidth: "300px",
                },
              }}
            >
              <Stack direction="row" spacing={1} p={1}>
                <Button
                  variant={txnType === 2 ? "contained" : "text"}
                  color="error"
                  onClick={() => setTxnType(2)}
                  fullWidth
                >
                  รายจ่าย
                </Button>
                <Button
                  variant={txnType === 1 ? "contained" : "text"}
                  color="success"
                  onClick={() => setTxnType(1)}
                  fullWidth
                >
                  รายรับ
                </Button>
              </Stack>
              <MenuItem value="" disabled>
                เลือกประเภท
              </MenuItem>
              {categories
                .filter((cat) => cat.type === txnType)
                .map((cat) => (
                  <MenuItem
                    key={cat.id}
                    value={cat.id}
                    onClick={() => {
                      formik.setFieldValue("category", cat);
                      setAnchorEl(undefined);
                    }}
                  >
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
                      <Tooltip title={cat.name}>
                        <Typography
                          variant="body1"
                          noWrap
                          textOverflow="ellipsis"
                        >
                          {cat.name}
                        </Typography>
                      </Tooltip>
                    </Stack>
                  </MenuItem>
                ))}
            </Menu>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              จำนวนเงิน
            </Typography>
            <TextField
              {...formik.getFieldProps("amount")}
              error={formik.touched["amount"] && !!formik.errors["amount"]}
              helperText={formik.touched["amount"] && formik.errors["amount"]}
              onBlur={() =>
                formik.setFieldValue(
                  "amount",
                  roundAmount(formik.values.amount || 0)
                )
              }
              fullWidth
            />
          </Grid>
          <Grid item md={8} xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              รายละเอียด (optional)
            </Typography>
            <TextField fullWidth />
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              ป้ายกำกับ (optional)
            </Typography>
            <TextField fullWidth />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              label="เปิดป๊อปอัพไว้หลังเพิ่มธุรกรรม"
              control={
                <Checkbox
                  color="success"
                  onChange={(e) => setPreventOnClose(e.target.checked)}
                />
              }
            />
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Button variant="text" onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="contained" sx={{ ml: 2 }}>
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddTransactionContainer;
