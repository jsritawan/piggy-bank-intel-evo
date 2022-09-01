import {
  Dialog,
  DialogTitle,
  Stack,
  Typography,
  Button,
  DialogContent,
  DialogActions,
  alpha,
  Box,
  IconButton,
  MenuItem,
  TextField,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCategories,
  ICategory,
} from "../../features/category/category-slice";
import * as yup from "yup";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { categoryRef } from "../../firebase";

interface Props {
  openConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  category: ICategory;
}

const SettingCategoryEditDialog: React.FC<Props> = ({
  category,
  openConfirm,
  onClose,
}) => {
  const paletteColors = useAppSelector((state) => state.master.paletteColors);
  const { uid } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [selectedColor, setSelectedColor] = useState<string>(category.color);
  const [isLoading, setLoading] = useState(false);

  const { errors, touched, getFieldProps, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        color: category.color,
        name: category.name,
        type: category.type,
      },
      validationSchema: yup.object().shape({
        color: yup.string().required(),
        name: yup.string().required(),
        type: yup.number().required(),
      }),
      onSubmit: async function ({ color, name, type }) {
        try {
          setLoading(true);
          if (!uid) {
            return;
          }
          await updateDoc(doc(categoryRef, category.id), {
            color,
            name,
            type,
            updateAt: serverTimestamp(),
          });
          dispatch(fetchCategories(uid));
          onClose();
        } finally {
          setLoading(false);
        }
      },
    });

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>แก้ไขหมวดหมู่</Typography>

          <Button
            variant="text"
            color="error"
            onClick={() => openConfirm(true)}
            disabled={!category.isEditable || isLoading}
          >
            ลบ
          </Button>
        </Stack>
      </DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: "16px 24px" }}>
          <Stack spacing="24px">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography
                color={touched.color && !!errors.color ? "error" : "inherit"}
              >
                สีหมวดหมู่ :{" "}
              </Typography>
              {paletteColors.map((pc) => (
                <IconButton
                  key={pc.id}
                  size="small"
                  sx={{
                    p: 0,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor:
                      pc.color === selectedColor
                        ? alpha(pc.color, 0.4)
                        : "transparent",
                  }}
                  onClick={() => {
                    setSelectedColor(pc.color);
                    setFieldValue("color", pc.color);
                  }}
                  disabled={!category.isEditable || isLoading}
                >
                  <Box
                    sx={{
                      borderRadius: "100%",
                      bgcolor: pc.color,
                      height: "24px",
                      width: "24px",
                    }}
                  />
                </IconButton>
              ))}
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                {...getFieldProps("type")}
                label="ประเภท"
                size="small"
                select
                error={touched.type && !!errors.type}
                helperText={touched.type && errors.type}
                disabled={!category.isEditable || isLoading}
              >
                <MenuItem value={1}>รายรับ</MenuItem>
                <MenuItem value={2}>รายจ่าย</MenuItem>
              </TextField>
              <TextField
                {...getFieldProps("name")}
                label="ชื่อหมวดหมู่"
                size="small"
                inputProps={{
                  autoComplete: "off",
                }}
                error={touched.name && !!errors.name}
                disabled={!category.isEditable || isLoading}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px" }}>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!category.isEditable || isLoading}
          >
            บันทึก
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SettingCategoryEditDialog;
