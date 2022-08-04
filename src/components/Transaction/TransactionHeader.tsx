import React from "react";
import { Fade, Grid, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useAppSelector } from "../../app/hooks";

const BalanceCard: React.FC<{ title: string; balance: number }> = ({
  title,
  balance,
}) => {
  return (
    <Stack
      sx={{
        bgcolor: "#fff",
        p: 2,
        width: "100%",
        borderRadius: 1,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.04)",
      }}
      spacing={1}
    >
      <Typography variant="body1" textOverflow={"ellipsis"} noWrap>
        {title}
      </Typography>
      <Typography
        variant="h5"
        color={balance >= 0 ? "#4BBEEA" : "error"}
        textOverflow={"ellipsis"}
        noWrap
      >
        {balance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    </Stack>
  );
};

const TransactionHeader = () => {
  const wallet = useAppSelector((state) => state.walletState.selectedWallet);
  return (
    <Fade in={!!wallet} unmountOnExit>
      <Box mt={2}>
        {wallet && (
          <Grid container spacing={2}>
            <Grid md={3} xs={6} item>
              <BalanceCard title="จำนวนเงินทั้งหมด" balance={wallet.balance} />
            </Grid>
            <Grid md={3} xs={6} item>
              <BalanceCard title="รายรับ" balance={wallet.balance} />
            </Grid>
            <Grid md={3} xs={6} item>
              <BalanceCard title="รายจ่าย" balance={wallet.balance} />
            </Grid>
            <Grid md={3} xs={6} item>
              <BalanceCard title="คงเหลือ" balance={wallet.balance} />
            </Grid>
          </Grid>
        )}
      </Box>
    </Fade>
  );
};

export default TransactionHeader;
