import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import {
  Stack,
  ButtonBase,
  Box,
  Typography,
  Button,
  Fade,
} from "@mui/material";
import { add, endOfMonth, format, startOfMonth, sub } from "date-fns";
import { isSameMonth } from "date-fns/esm";
import { th } from "date-fns/locale";
import React, { useEffect, useState } from "react";

const PeriodContainer = () => {
  const [period, setPeriod] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const startOf = startOfMonth(date);
    const endOf = endOfMonth(date);
    const formatTemplate = "dd MMM yyyy";
    const formatedStart = format(startOf, formatTemplate, { locale: th });
    const formatedEnd = format(endOf, formatTemplate, { locale: th });
    setPeriod(`${formatedStart} - ${formatedEnd}`);
  }, [date]);

  const prev = () => {
    setDate(sub(date, { months: 1 }));
  };

  const next = () => {
    setDate(add(date, { months: 1 }));
  };

  return (
    <Stack direction="row" spacing={1}>
      <ButtonBase
        sx={{
          height: "40px",
          width: "40px",
          minWidth: 0,
          borderRadius: 1,
          bgcolor: "#fff",
        }}
        onClick={prev}
      >
        <ChevronLeftRounded />
      </ButtonBase>

      <Box
        sx={{
          p: 1,
          height: "40px",
          bgcolor: "#fff",
          borderRadius: 1,
          minWidth: "300px",
        }}
      >
        <Fade key={date.toString()} in>
          <Typography textAlign="center">{period}</Typography>
        </Fade>
      </Box>

      <ButtonBase
        sx={{
          height: "40px",
          width: "40px",
          minWidth: 0,
          borderRadius: 1,
          bgcolor: "#fff",
        }}
        onClick={next}
      >
        <ChevronRightRounded />
      </ButtonBase>
      {!isSameMonth(date, new Date()) && (
        <Button variant="text" onClick={() => setDate(new Date())}>
          ไปที่เดือนปัจจุบัน
        </Button>
      )}
    </Stack>
  );
};

export default PeriodContainer;
