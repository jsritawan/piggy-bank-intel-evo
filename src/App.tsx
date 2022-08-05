import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Route, Routes } from "react-router-dom";
import Transaction from "./pages/Transaction";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AppLayout from "./layouts/AppLayout";
import { Settings } from "./components/Settings";

function App() {
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
