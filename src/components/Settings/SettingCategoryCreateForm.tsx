import {
  Typography,
  Divider,
  Stack,
  TextField,
  MenuItem,
  Box,
  Button,
  IconButton,
  alpha,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import * as yup from "yup";

const SettingCategoryCreateForm = () => {
  const paletteColors = useAppSelector((state) => state.master.paletteColors);
  const [selectedColorId, setSelectedColorId] = useState<string>();

  const { errors, touched, getFieldProps, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        color: "",
        name: "",
        type: 1,
      },
      validationSchema: yup.object().shape({
        color: yup.string().required(),
        name: yup.string().required(),
        type: yup.number().required(),
      }),
      onSubmit: function (values, { resetForm }) {
        console.log({ values });
        resetForm();
        setSelectedColorId(undefined);
      },
    });

  return (
    <Box>
      <Typography>เพิ่มหมวดหมู่ใหม่</Typography>
      <Divider sx={{ my: 2 }} />
      <form onSubmit={handleSubmit}>
        <Stack spacing={1}>
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
                    pc.id === selectedColorId
                      ? alpha(pc.color, 0.4)
                      : "transparent",
                }}
                onClick={() => {
                  setSelectedColorId(pc.id);
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
          <Box>
            <Button type="submit" size="small" variant="contained">
              เพิ่มหมวดหมู่
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default SettingCategoryCreateForm;
