import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Fade, Grid, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setDefaultWallet } from "../../features/wallets/wallets-slice";

interface IProps {
  title: string;
  balance: number;
  color?: string;
}

const BalanceCard: FunctionComponent<IProps> = ({
  title,
  balance,
  color: colorProps,
}) => {
  const color = useMemo(() => {
    if (colorProps) {
      return colorProps;
    }
    return balance >= 0 ? "#4BBEEA" : "error";
  }, [balance, colorProps]);

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
      <Typography variant="h5" color={color} textOverflow={"ellipsis"} noWrap>
        {balance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    </Stack>
  );
};

const TransactionHeader = () => {
  const dispatch = useAppDispatch();
  const { defaultWallet: wallet, wallets } = useAppSelector(
    (state) => state.walletState
  );
  const transactions = useAppSelector((state) => state.txn.transactions);

  const [detail, setDetail] = useState({
    expense: 0,
    income: 0,
    total: 0,
  });

  useEffect(() => {
    dispatch(setDefaultWallet(wallets.find((w) => w.default)));
  }, [wallets, dispatch]);

  useEffect(() => {
    let expense = 0;
    let income = 0;

    for (let txn of transactions) {
      if (txn.type === 1) {
        income += txn.amount;
      } else {
        expense += txn.amount;
      }
    }

    setDetail({
      income,
      expense,
      total: income - expense,
    });
  }, [transactions]);

  return (
    <Fade in={!!wallet} unmountOnExit>
      <Box mt={2}>
        {wallet && (
          <Grid container spacing={2}>
            <Grid md={3} xs={6} item>
              <BalanceCard title="จำนวนเงินทั้งหมด" balance={wallet.balance} />
            </Grid>
            <Grid md={3} xs={6} item>
              <BalanceCard
                title="รายรับ"
                balance={detail.income}
                color="#4BBEEA"
              />
            </Grid>
            <Grid md={3} xs={6} item>
              <BalanceCard
                title="รายจ่าย"
                balance={detail.expense}
                color="error"
              />
            </Grid>
            <Grid md={3} xs={6} item>
              <BalanceCard title="คงเหลือ" balance={detail.total} />
            </Grid>
          </Grid>
        )}
      </Box>
    </Fade>
  );
};

export default TransactionHeader;
