import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Select,
  Button,
  Avatar,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";

type TransactionType = "INCOME" | "EXPENSE";
type TransactionCategory = {
  id: string;
  type: TransactionType;
  name: string;
  color: string;
};

const paletteColors = [
  "#4BBEEA",
  "#ba68c8",
  "#ef5350",
  "#ff9800",
  "#4caf50",
  "#35393E",
];

const AddTransactionContainer = () => {
  const [selectedType, setSelectedType] = useState<TransactionCategory>();
  const [txnType, setTxnType] = useState<TransactionType>("EXPENSE");
  const [typeList] = useState<TransactionCategory[]>([
    { id: "1", type: "INCOME", name: "salary", color: "#4caf50" },
    { id: "2", type: "INCOME", name: "gift", color: "#ff9800" },
    { id: "3", type: "EXPENSE", name: "food", color: "#ef5350" },
    { id: "4", type: "EXPENSE", name: "transport", color: "#35393E" },
  ]);

  useEffect(() => {
    setSelectedType(undefined);
  }, [txnType]);

  return (
    <Box sx={{ borderRadius: 1, bgcolor: "#fff", p: 1 }}>
      <Stack direction="row">
        {/* <TextField value={selectedType?.name || ""} /> */}
        <FormControl fullWidth>
          <InputLabel id="select-type-label">ประเภท</InputLabel>
          <Select
            label="ประเภท"
            value={selectedType?.id || ""}
            renderValue={() => {
              if (selectedType) {
                return <span>{selectedType.name}</span>;
              }
            }}
            onChange={(evt) =>
              setSelectedType(typeList.find((t) => t.id === evt.target.value))
            }
          >
            <Stack direction="row" spacing={1} p={1}>
              <Button
                variant={txnType === "EXPENSE" ? "contained" : "text"}
                color="error"
                onClick={() => setTxnType("EXPENSE")}
                fullWidth
              >
                รายจ่าย
              </Button>
              <Button
                variant={txnType === "INCOME" ? "contained" : "text"}
                color="success"
                onClick={() => setTxnType("INCOME")}
                fullWidth
              >
                รายรับ
              </Button>
            </Stack>
            <MenuItem value="" disabled>
              เลือกประเภท
            </MenuItem>
            {typeList
              .filter((t) => t.type === txnType)
              .map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  <Box
                    sx={{
                      height: "24px",
                      width: "24px",
                      bgcolor: t.color,
                      mr: 1,
                      borderRadius: "100%",
                    }}
                  />
                  {t.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default AddTransactionContainer;
