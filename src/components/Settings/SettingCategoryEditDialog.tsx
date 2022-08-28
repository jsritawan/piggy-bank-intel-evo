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
import { useAppSelector } from "../../app/hooks";
import { Category } from "../../features/category/category-slice";
import * as yup from "yup";

interface Props {
  openConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  category: Category;
}

const SettingCategoryEditDialog: React.FC<Props> = ({
  category,
  openConfirm,
  onClose,
}) => {
  const paletteColors = useAppSelector((state) => state.master.paletteColors);
  const [selectedColor, setSelectedColor] = useState<string>(category.color);

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
      onSubmit: function (values) {
        console.log({ values });
        onClose();
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
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px" }}>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button type="submit" variant="contained">
            บันทึก
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SettingCategoryEditDialog;
