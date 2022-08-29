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
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as yup from "yup";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { categoryRef } from "../../firebase";
import { grey, red } from "@mui/material/colors";
import { fetchCategories } from "../../features/category/category-slice";

const SettingCategoryCreateForm = () => {
  const paletteColors = useAppSelector((state) => state.master.paletteColors);
  const categories = useAppSelector((state) => state.categories.categories);
  const { uid } = useAppSelector((state) => state.auth.user);

  const dispatch = useAppDispatch();

  const [selectedColorId, setSelectedColorId] = useState<string>();
  const [disabled, setDisabled] = useState(false);

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
      onSubmit: async ({ name, color, type }, { resetForm }) => {
        if (categories.length === 50) {
          return;
        }

        setDisabled(true);
        setDoc(doc(categoryRef), {
          color,
          name,
          type,
          uid,
          isDeletable: true,
          isEditable: true,
          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        })
          .then(() => {
            if (uid) {
              dispatch(fetchCategories(uid));
            }
          })
          .finally(() => {
            resetForm();
            setSelectedColorId(undefined);
            setDisabled(false);
          });
      },
    });

  useEffect(() => {
    setDisabled(categories.length === 50);
  }, [categories]);

  return (
    <Box>
      <Typography>
        หมวดหมู่ทั้งหมด
        <Typography
          component="span"
          fontSize="12px"
          ml={1}
          sx={{ color: categories.length === 50 ? red : grey[600] }}
        >
          ({categories.length}/50)
        </Typography>
      </Typography>
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
                disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
            />
          </Stack>
          <Box>
            <Button
              type="submit"
              size="small"
              variant="contained"
              disabled={disabled}
            >
              เพิ่มหมวดหมู่
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default SettingCategoryCreateForm;
