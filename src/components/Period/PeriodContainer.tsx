import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import { Stack, ButtonBase, Typography, Button, Fade } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { add, endOfMonth, format, startOfMonth, sub } from "date-fns";
import { isSameMonth } from "date-fns/esm";
import { th } from "date-fns/locale";
import { useEffect, useState } from "react";

const PeriodContainer = () => {
  const [period, setPeriod] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

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
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.04)",
        }}
        onClick={prev}
      >
        <ChevronLeftRounded />
      </ButtonBase>

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
        <DatePicker
          open={openDatePicker}
          onClose={() => setOpenDatePicker(false)}
          views={["year", "month", "day"]}
          value={date}
          onChange={(value) => {
            if (value) {
              setDate(value);
            }
          }}
          renderInput={({ inputRef }) => (
            <ButtonBase
              ref={inputRef}
              sx={{
                p: 1,
                height: "40px",
                bgcolor: "#fff",
                borderRadius: 1,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.04)",
                minWidth: "300px",
              }}
              onClick={() => setOpenDatePicker(!openDatePicker)}
            >
              <Fade key={date.toString()} in>
                <Typography textAlign="center">{period}</Typography>
              </Fade>
            </ButtonBase>
          )}
        />
      </LocalizationProvider>

      <ButtonBase
        sx={{
          height: "40px",
          width: "40px",
          minWidth: 0,
          borderRadius: 1,
          bgcolor: "#fff",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.04)",
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
