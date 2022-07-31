import { Container } from "@mui/system";
import { Box, Button, Collapse, Stack } from "@mui/material";

import { grey } from "@mui/material/colors";
import { useState } from "react";
import Header from "./components/Header/Header";
import PeriodContainer from "./components/Period/PeriodContainer";
import AddTransactionContainer from "./components/AddTransaction/AddTransactionContainer";

function App() {
  const [open, setOpen] = useState(true);
  return (
    <Box sx={{ bgcolor: grey[100], height: "100%" }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Stack spacing={2}>
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
            <AddTransactionContainer setOpen={setOpen} />
          </Collapse>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
