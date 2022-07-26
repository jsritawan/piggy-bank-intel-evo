import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Container } from "@mui/system";
import { Box, Button, Collapse, Stack } from "@mui/material";

import Header from "../Header/Header";
import { grey } from "@mui/material/colors";
import PeriodContainer from "../Period/PeriodContainer";
import { useState } from "react";
import AddTransactionContainer from "../AddTransaction/AddTransactionContainer";

function App() {
  const [open, setOpen] = useState(true);
  return (
    <Box sx={{ bgcolor: grey[100], height: "100%" }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Stack spacing={1}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <PeriodContainer />
            <Button variant="contained" onClick={() => setOpen(!open)}>
              เพิ่มธรุกรรม
            </Button>
          </Box>
          <Collapse in={open}>
            <AddTransactionContainer />
          </Collapse>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
