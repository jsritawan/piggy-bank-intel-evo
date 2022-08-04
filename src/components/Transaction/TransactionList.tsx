import {
  Box,
  ButtonBase,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useEffect, useState } from "react";

interface ITxn {
  date: string;
  type: number;
  note: string;
  amount: number;
}
const TransactionList = () => {
  const [txnList] = useState<ITxn[]>([
    {
      date: "Thu Aug 04 2022 16:40:26 GMT+0700 (Indochina Time)",
      type: 2,
      note: "adsdsdds",
      amount: 100,
    },
    {
      date: "Thu Aug 04 2022 16:40:26 GMT+0700 (Indochina Time)",
      type: 2,
      note: "ddd",
      amount: 300,
    },
    {
      date: "Thu Aug 04 2022 16:40:26 GMT+0700 (Indochina Time)",
      type: 1,
      note: "dsdsccccc",
      amount: 150,
    },
    {
      date: "Thu Aug 03 2022 16:40:26 GMT+0700 (Indochina Time)",
      type: 1,
      note: "adsdsdds",
      amount: 100,
    },
    {
      date: "Thu Aug 02 2022 16:40:26 GMT+0700 (Indochina Time)",
      type: 1,
      note: "adsdsdds",
      amount: 100,
    },
    {
      date: "Thu Aug 01 2022 16:40:26 GMT+0700 (Indochina Time)",
      type: 1,
      note: "adsdsdds",
      amount: 100,
    },
  ]);

  const [txnMap, setTxnMap] = useState<Map<string, ITxn[]>>(new Map());

  useEffect(() => {
    if (!Array.isArray(txnList)) {
      return;
    }
    const map = new Map<string, ITxn[]>();
    for (let i = 0; i < txnList.length; i++) {
      const t = txnList[i];
      const date = format(new Date(t.date), "dd MMM yyyy", { locale: th });
      const list = map.get(date) || [];
      list.push(t);
      map.set(date, list);
    }

    setTxnMap(map);
  }, [txnList]);

  return (
    <Stack spacing={2} mt={2}>
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
          <Stack
            direction={"row"}
            justifyContent="space-between"
            alignItems={"center"}
            mb={1}
            p={1}
          >
            <Typography variant="body1"> {key}</Typography>
            <Typography variant="body1">
              {value
                .map((t) => (t.type === 1 ? t.amount : t.amount * -1))
                .reduce((prev, cur) => prev + cur, 0)
                .toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </Typography>
          </Stack>
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
                      bgcolor: "teal",
                      height: "24px",
                      width: "24px",
                    }}
                  />
                  <Stack flexGrow={1} spacing={0.25} textAlign="left">
                    <Typography variant="body1">{txn.note}</Typography>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      {txn.note}
                    </Typography>
                    <Stack
                      direction={"row"}
                      spacing={1}
                      alignContent={"center"}
                      sx={{ minHeight: "24px" }}
                    >
                      {/* TODO: Loop through label */}
                      <Chip label={txn.note} size="small" />
                      <Chip label={txn.note} size="small" />
                    </Stack>
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
