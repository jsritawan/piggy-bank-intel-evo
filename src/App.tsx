import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Transaction from "./pages/Transaction";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AppLayout from "./layouts/AppLayout";
import Settings from "./pages/Settings";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { updateUserAuth } from "./features/auth/auth-slice";
import { auth } from "./firebase";
import { useAppDispatch } from "./app/hooks";
import { setTransactions } from "./features/transactions/transactions-slice";
import { setCategories } from "./features/category/category-slice";
import { setDefaultWallet, setWallets } from "./features/wallets/wallets-slice";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        dispatch(
          updateUserAuth({
            uid: null,
            name: null,
            email: null,
            photoURL: null,
            authenticated: false,
          })
        );
        dispatch(setTransactions([]));
        dispatch(setCategories([]));
        dispatch(setWallets([]));
        dispatch(setDefaultWallet(undefined));
        navigate("/login");
      } else {
        dispatch(
          updateUserAuth({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            authenticated: true,
          })
        );

        if (pathname.startsWith("/login")) {
          navigate("/");
        }
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate, pathname]);

  return (
    <Box sx={{ bgcolor: grey[100], height: "100vh", pb: 4, overflow: "auto" }}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Transaction />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}

export default App;
