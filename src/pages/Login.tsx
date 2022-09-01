import React, { useCallback, useState } from "react";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { categoryRef, db, masCatColRef, signInWithGoogle } from "../firebase";
import { FirebaseError } from "firebase/app";
import { SavingsRounded } from "@mui/icons-material";
import {
  query,
  where,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { isEmpty } from "lodash";

const Login = () => {
  const [isLoading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignInWithGmail = useCallback(async () => {
    try {
      setLoading(true);
      const { user } = await signInWithGoogle();

      const q = query(categoryRef, where("uid", "==", user.uid), limit(1));
      let snapshot = await getDocs(q);

      if (!isEmpty(snapshot.docs)) {
        return;
      }

      const masSnapshot = await getDocs(query(masCatColRef, orderBy("name")));
      const batch = writeBatch(db);
      masSnapshot.docs.forEach(async (d) => {
        const data = d.data();
        const { color, name, type, isDeletable, isEditable } = data;
        batch.set(doc(categoryRef), {
          color,
          name,
          type,
          uid: user.uid,
          isDeletable: data["isDeletable"] !== undefined ? isDeletable : true,
          isEditable: data["isEditable"] !== undefined ? isEditable : true,
          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(error.message);
        setOpenSnackbar(true);
        return;
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOnSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <React.Fragment>
      <Box
        display="flex"
        minHeight={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        p={3}
        sx={{
          backgroundImage:
            "url('/images/evo-i5i7i9-family-badges-right-rgb.png'), url('/images/evo-family-badges-left-i9i7i5.png')",
          backgroundSize: "auto 200px, auto 200px",
          backgroundPosition: "bottom right, bottom left",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 1,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.04)",
            minWidth: "375px",
            overflow: "clip",
            position: "relative",
          }}
        >
          {isLoading && (
            <LinearProgress
              sx={{ position: "absolute", top: "0px", width: "100%" }}
            />
          )}
          <Box sx={{ p: 3 }}>
            <Stack justifyContent="center" spacing="16px">
              <Box display="flex" alignItems="center">
                <SavingsRounded fontSize="large" sx={{ color: "#02C7FD" }} />
                <Typography variant="h4" ml={1}>
                  Piggy Bank x Intel Evo
                </Typography>
              </Box>

              <Typography></Typography>

              <Box width="100%" textAlign="center">
                <Box
                  component="img"
                  src="/images/EVO-PL~1(3).PNG"
                  width="auto"
                  height="120px"
                />
              </Box>
              <Button
                variant="contained"
                color="error"
                onClick={handleSignInWithGmail}
                fullWidth
              >
                sign in with gmail
              </Button>
            </Stack>
          </Box>
        </Box>
        <Stack
          width="100%"
          sx={{
            textShadow: "0px 0px 3px #fff",
          }}
        >
          <Typography mt={5} variant="caption" textAlign="center">
            เว็บไซต์นี้สร้างขึ้นเพื่อใช้ในการเข้าร่วมกิจกรรม{" "}
            <Typography
              component="span"
              variant="caption"
              sx={{ textDecoration: "underline" }}
            >
              Intel Evo Challenge “ศึกดวล Dev ไวเหนือแสง ไม่แฮงค์แน่นอน”
            </Typography>{" "}
            เท่านั้น
          </Typography>
          <Typography variant="caption" textAlign="center">
            ผู้พัฒนาจะทำการลบข้อมูลทั้งหมด ภายในเวลา 30
            วันนับจากวันประกาศผลรางวัล (16 กันยายน 2565)
          </Typography>
          <Typography variant="caption" textAlign="center">
            ตามที่ได้ประกาศไว้ในเพจ{" "}
            <a
              href="https://fb.watch/fgmor2v5Cv/"
              target="_blank"
              rel="noreferrer"
            >
              BorntoDev
            </a>{" "}
            หากมีข้อสงสัยติดต่อ{" "}
            <a href="mailto:jsritawan@gmail.com">jsritawan@gmail.com</a>
          </Typography>
        </Stack>
      </Box>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={handleOnSnackbarClose}
        autoHideDuration={6000}
      >
        <Alert severity="error" onClose={handleOnSnackbarClose}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Login;
