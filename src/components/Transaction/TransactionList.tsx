import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  FunctionComponent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteTransaction,
  fetchTransaction,
  ITransaction,
} from "../../features/transactions/transactions-slice";
import { updateWalletBalance } from "../../features/wallets/wallets-slice";
import AddTransactionContainer from "../AddTransaction/AddTransactionContainer";

interface ITransactionItemHeaderProps {
  date: string;
  value: ITransaction[];
}

const TransactionItemHeader: FunctionComponent<ITransactionItemHeaderProps> = ({
  date,
  value,
}) => {
  const total = useMemo(
    () =>
      value
        .map((t) => (t.type === 1 ? t.amount : t.amount * -1))
        .reduce((prev, cur) => prev + cur, 0),
    [value]
  );

  return (
    <Stack
      direction={"row"}
      justifyContent="space-between"
      alignItems={"center"}
      mb={1}
      p={1}
    >
      <Typography variant="body1">{date}</Typography>
      <Typography variant="body1" color={total >= 0 ? "#4BBEEA" : "error"}>
        {total.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    </Stack>
  );
};

const TransactionList: FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const { transactions: txnList } = useAppSelector((state) => state.txn);
  const categories = useAppSelector((state) => state.categories.categories);
  const wallet = useAppSelector((state) => state.walletState.defaultWallet);

  const [txnMap, setTxnMap] = useState<Map<string, ITransaction[]>>(new Map());
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [transaction, setTransaction] = useState<ITransaction>();
  const [isDeleting, setDeleting] = useState(false);

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };
  const handleOnClickTxn = useCallback(
    (txn: ITransaction) => (_e: MouseEvent<HTMLButtonElement>) => {
      setOpenEditDialog(true);
      setTransaction(txn);
    },
    []
  );
  const handleDeleteTxn = useCallback(async () => {
    if (!transaction || !wallet || !openEditDialog) {
      return;
    }

    setDeleting(true);
    const { type, amount } = transaction;
    const changed = type === 1 ? amount * -1 : amount;
    const balance = wallet.balance + changed;
    const deleteResult = await dispatch(
      deleteTransaction({
        txnId: transaction.id,
        balance: balance,
        wallet: wallet,
      })
    );

    if (!deleteTransaction.fulfilled.match(deleteResult)) {
      return;
    }

    setDeleting(false);
    setOpenEditDialog(false);

    dispatch(updateWalletBalance(balance));

    await dispatch(
      fetchTransaction({
        date: new Date(transaction.displayDate),
        walletId: wallet.id,
        uid: transaction.uid,
      })
    );
  }, [dispatch, openEditDialog, transaction, wallet]);

  useEffect(() => {
    if (!Array.isArray(txnList)) {
      return;
    }
    const map = new Map<string, ITransaction[]>();
    for (let i = 0; i < txnList.length; i++) {
      const t = txnList[i];
      const date = format(new Date(t.displayDate), "dd MMM yyyy", {
        locale: th,
      });
      const list = map.get(date) || [];
      list.push(t);
      map.set(date, list);
    }

    setTxnMap(map);
  }, [txnList]);

  return (
    <Stack spacing={2} mt={2}>
      {txnMap.size === 0 && (
        <Typography variant="body1" textAlign="center">
          ไม่มีรายการธุระกรรมภายในเดือนนี้
        </Typography>
      )}
      {Array.from(txnMap, ([key, value]) => (
        <Box
          key={key}
          sx={{
            bgcolor: "#fff",
            borderRadius: 1,
            p: 1,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <TransactionItemHeader date={key} value={value} />
          <Divider />
          {value.map((txn, index) => (
            <Box key={index} mt={1}>
              <ButtonBase
                sx={{
                  width: "100%",
                  borderRadius: 1,
                  p: 1,
                }}
                onClick={handleOnClickTxn(txn)}
              >
                <Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      borderRadius: "100%",
                      bgcolor: getCategory(txn.categoryId)?.color ?? "grey",
                      height: "24px",
                      width: "24px",
                    }}
                  />
                  <Stack flexGrow={1} spacing={0.25} textAlign="left">
                    <Typography variant="body1">
                      {getCategory(txn.categoryId)?.name || ""}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      {txn.note}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    color={txn.type === 1 ? "#4BBEEA" : "error"}
                  >
                    {txn.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Stack>
              </ButtonBase>
            </Box>
          ))}
        </Box>
      ))}

      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
        }}
      >
        <DialogTitle
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1">แก้ไขธรุกรรม</Typography>
          <Button color="error" onClick={handleDeleteTxn}>
            ลบ
          </Button>
        </DialogTitle>
        <DialogContent>
          {transaction && (
            <AddTransactionContainer
              date={new Date(transaction.displayDate)}
              transaction={transaction}
              setOpen={setOpenEditDialog}
              disabled={isDeleting}
            />
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default TransactionList;
