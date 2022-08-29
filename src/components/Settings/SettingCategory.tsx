import { DeleteRounded, WarningAmberRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { isEmpty } from "lodash";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCategories,
  ICategory,
} from "../../features/category/category-slice";
import SettingCategoryCreateForm from "./SettingCategoryCreateForm";
import SettingCategoryEditDialog from "./SettingCategoryEditDialog";

const SettingCategoryList: React.FC<{
  type: number;
  openDialog: (cat: ICategory) => void;
  onDelete: (docId: string) => void;
}> = ({ type, openDialog, onDelete }) => {
  const theme = useTheme();
  const categories = useAppSelector((state) => state.categories.categories);
  const { uid, authenticated } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [mouseOverItemId, setMouseOverItemId] = useState<string>();

  const filteredCategories = useMemo(
    () => categories?.filter((cat) => cat.type === type),
    [categories, type]
  );

  const onClickDelete = useCallback(
    (catId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      // check if not use then delete otherwise open confirm dialog.
      onDelete(catId);
    },
    [onDelete]
  );

  useEffect(() => {
    if (authenticated && uid) {
      dispatch(fetchCategories(uid));
    }
  }, [authenticated, dispatch, uid]);

  return (
    <Box>
      <Typography>
        {type === 1 ? "รายรับ" : "รายจ่าย"}
        <Typography
          component="span"
          fontSize="12px"
          ml={1}
          sx={{ color: grey[600] }}
        >
          ({filteredCategories.length})
        </Typography>
      </Typography>
      <Divider sx={{ my: 2 }} />
      <List
        disablePadding
        sx={{
          width: "100%",
        }}
      >
        {filteredCategories.map((cat) => (
          <ListItemButton
            key={cat.id}
            onClick={() => openDialog(cat)}
            sx={{
              borderRadius: 1,
              minHeight: "56px",
            }}
            onMouseEnter={() => setMouseOverItemId(cat.id)}
            onMouseLeave={() => setMouseOverItemId(undefined)}
          >
            <ListItemAvatar>
              <Box
                sx={{
                  bgcolor: cat.color,
                  width: theme.spacing(3),
                  height: theme.spacing(3),
                  borderRadius: "100%",
                }}
              />
            </ListItemAvatar>
            <ListItemText>{cat.name}</ListItemText>
            <ListItemAvatar
              sx={{
                display: "flex",
                justifyContent: "end",
                width: theme.spacing(3),
              }}
            >
              {cat.isDeletable && cat.id === mouseOverItemId && (
                <IconButton onClick={onClickDelete(cat.id)}>
                  <DeleteRounded color="error" />
                </IconButton>
              )}
            </ListItemAvatar>
          </ListItemButton>
        ))}
        {isEmpty(filteredCategories) && (
          <ListItemText sx={{ textAlign: "center" }}>ไม่พบข้อมูล</ListItemText>
        )}
      </List>
    </Box>
  );
};

const SettingCategory = () => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [cat, setCat] = useState<ICategory>();

  const handleEditDialogOpen = (category: ICategory) => {
    setCat(category);
    setOpenEditDialog(true);
  };
  const handleEditDialogClose = () => {
    setCat(undefined);
    setOpenEditDialog(false);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);
    setOpenEditDialog(false);
  };

  const handleConfirmDialogClose = () => {
    setOpenConfirmDialog(false);
  };

  const onDelete = (catId: string) => {
    console.log(catId);
  };

  return (
    <>
      <Stack spacing="16px" sx={{ width: "100%" }}>
        <SettingCategoryCreateForm />

        <SettingCategoryList
          type={1}
          openDialog={handleEditDialogOpen}
          onDelete={onDelete}
        />
        <SettingCategoryList
          type={2}
          openDialog={handleEditDialogOpen}
          onDelete={onDelete}
        />
      </Stack>

      {openEditDialog && cat && (
        <SettingCategoryEditDialog
          openConfirm={setOpenConfirmDialog}
          category={cat}
          onClose={handleEditDialogClose}
        />
      )}

      {openConfirmDialog && (
        <Dialog open onClose={handleConfirmDialogClose}>
          <DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <WarningAmberRounded color="warning" />
              <Typography variant="h6">คำเตือน</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              คุณต้องการลบหมวดหมู่นี้หรือไม่?
            </DialogContentText>
            <DialogContentText>
              หากคุณยืนยัน ธุรกรรมทั้งหมดที่ใช้หมวดหมู่นี้จะถูกลบไปด้วย
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmDialogClose} variant="contained">
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default SettingCategory;
