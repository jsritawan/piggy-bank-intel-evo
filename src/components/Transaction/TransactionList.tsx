import { Box, ButtonBase, Divider, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { ITransaction } from "../../features/transactions/transactions-slice";

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
  const { transactions: txnList } = useAppSelector((state) => state.txn);
  const categories = useAppSelector((state) => state.categories.categories);

  const [txnMap, setTxnMap] = useState<Map<string, ITransaction[]>>(new Map());

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

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
    </Stack>
  );
};

export default TransactionList;
