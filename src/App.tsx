import { Container } from "@mui/system";
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { grey } from "@mui/material/colors";
import { useState } from "react";
import Header from "./components/Header/Header";
import PeriodContainer from "./components/Period/PeriodContainer";
import AddTransactionContainer from "./components/AddTransaction/AddTransactionContainer";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { addWallet, selectWallet } from "./features/wallets/wallets-slice";

function App() {
  const wallets = useAppSelector((state) => state.walletState.wallets);
  const selectedWallet = useAppSelector(
    (state) => state.walletState.selectedWallet
  );
  const userId = "userId";
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [openAddWalletDialog, setOpenAddWalletDialog] = useState(false);

  const [walletName, setWalletName] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  const handleSelectWallet = (walletId: string) => {
    dispatch(selectWallet(walletId));
  };

  const handleOnSaveWallet = () => {
    dispatch(
      addWallet({
        id: new Date().toString(),
        userId,
        name: walletName,
        balance: walletBalance,
        createAt: new Date().toString(),
      })
    );
    setOpenAddWalletDialog(false);
    setWalletName("");
    setWalletBalance(0);
  };

  return (
    <Box sx={{ bgcolor: grey[100], height: "100%" }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        {!selectedWallet && (
          <>
            <Grid container spacing={4}>
              {wallets.map((w) => (
                <Grid item key={w.id} md={4} xs={6}>
                  <ButtonBase
                    sx={{ p: 0, width: "100%" }}
                    onClick={() => handleSelectWallet(w.id)}
                  >
                    <Stack
                      sx={{
                        borderRadius: 1,
                        bgcolor: "#fff",
                        p: 2,
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <Typography variant="h5">{w.name}</Typography>
                      <Typography variant="caption" color="grey">
                        Balance
                      </Typography>
                      <Typography
                        variant="h4"
                        color={w.balance >= 0 ? "#4BBEEA" : "error"}
                      >
                        {new Intl.NumberFormat("en-TH", {
                          style: "currency",
                          currency: "THB",
                        }).format(w.balance)}
                      </Typography>
                    </Stack>
                  </ButtonBase>
                </Grid>
              ))}
              <Grid item md={4} xs={6}>
                <Button
                  variant="contained"
                  onClick={() => setOpenAddWalletDialog(true)}
                  fullWidth
                >
                  เพิ่มกระเป๋าสตางค์
                </Button>
              </Grid>
            </Grid>
            <Dialog
              open={openAddWalletDialog}
              onClose={() => setOpenAddWalletDialog(false)}
            >
              <DialogTitle>เพิ่มกระเป๋าสตางค์</DialogTitle>
              <DialogContent>
                <Stack direction="row" spacing={1}>
                  <Stack spacing={1}>
                    <Typography component="label">ชื่อกระเป๋าสตางค์</Typography>
                    <TextField
                      value={walletName}
                      placeholder="ชื่อกระเป๋าสตางค์"
                      required
                      onChange={(e) => setWalletName(e.target.value)}
                    />
                  </Stack>
                  <Stack spacing={1}>
                    <Typography component="label">จำนวนเงิน</Typography>
                    <TextField
                      value={walletBalance}
                      type="number"
                      placeholder="จำนวนเงิน"
                      inputProps={{ min: 0 }}
                      onChange={(e) => setWalletBalance(+e.target.value)}
                    />
                  </Stack>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: "16px 24px" }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenAddWalletDialog(false)}
                >
                  ยกเลิก
                </Button>
                <Button variant="contained" onClick={handleOnSaveWallet}>
                  บันทึก
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        {selectedWallet && (
          <>
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
            </Stack>
            <Dialog
              open={open}
              onClose={() => {
                setOpen(false);
              }}
            >
              <DialogContent>
                <AddTransactionContainer setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </>
        )}
      </Container>
    </Box>
  );
}

export default App;
