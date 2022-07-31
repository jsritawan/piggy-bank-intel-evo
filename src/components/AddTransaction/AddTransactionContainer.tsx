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
} from "@mui/material";
import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { Category, CategoryType } from "../../features/category/category-slice";
import { Transaction } from "../../features/transactions/transactions-slice";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  category: yup.object().required(),
  note: yup.string(),
  labels: yup.array().of(yup.string()),
  amount: yup.number().required(),
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [txnType, setTxnType] = useState<CategoryType>(2);
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();

  const selectedType = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const initialValues: Partial<TransactionForm> = {
    date: undefined,
    category: undefined,
    note: "",
    labels: [],
    amount: 0,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      setOpen(false);
    },
  });

  return (
    <Box sx={{ borderRadius: 1, bgcolor: "#fff", p: 2 }}>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1} columns={2} sx={{ m: 0 }}>
            <Grid md={1} xs={2}>
              <Box>
                <input />
              </Box>
            </Grid>
            <Grid md={1} xs={2}>
              <input />
            </Grid>
            <Grid md={1} xs={2}>
              <input />
            </Grid>
            <Grid md={1} xs={2}>
              <input />
            </Grid>
            <Grid xs={2}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                  mt: 1,
                }}
              >
                <Button type="submit" variant="contained">
                  บันทึก
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* <Stack direction="row" spacing={2}>
          <TextField
            label="ประเภท"
            value={selectedType?.name || ""}
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
            }}
            InputProps={{
              readOnly: true,
              endAdornment: anchorEl ? (
                <ArrowDropUpRounded />
              ) : (
                <ArrowDropDownRounded />
              ),
            }}
          />
          <TextField label="รายละเอียด" />
          <TextField label="label" />
          <Stack spacing={1}>
            <Typography component="label">จำนวนเงิน</Typography>
            <TextField
              {...formik.getFieldProps("amount")}
              placeholder="จำนวนเงิน"
              error={formik.touched["amount"] && !!formik.errors["amount"]}
            />
          </Stack>
        </Stack>
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 1 }}
        >
          <Button type="submit" variant="contained">
            บันทึก
          </Button>
        </Box> */}
      </form>

      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(undefined)}
        PaperProps={{
          sx: {
            minWidth: "280px",
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
                setSelectedCategoryId(cat.id);
                setAnchorEl(undefined);
              }}
            >
              <Box
                sx={{
                  height: "24px",
                  width: "24px",
                  bgcolor: cat.color,
                  mr: 1,
                  borderRadius: "100%",
                }}
              />
              {cat.name}
            </MenuItem>
          ))}
      </Menu> */}
    </Box>
  );
};

export default AddTransactionContainer;
