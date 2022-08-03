import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import Header from "./components/Header/Header";
import AppContainer from "./components/AppContainer";

function App() {
  return (
    <Box
      sx={{ bgcolor: grey[100], height: "100vh", pb: 4, overflow: "scroll" }}
    >
      <Header />
      <AppContainer />
    </Box>
  );
}

export default App;
